import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
  getCalendarEvents,
  rescheduleCalendarEvent,
  scheduleCalendarEvent,
  type CalendarRescheduleResult,
  type CalendarScheduleResult,
} from "@/domain/calendar/calendarStore";
import { parseEventInput } from "@/domain/calendar/eventComposer";
import { checkAvailability } from "@/domain/calendar/scheduling/checkAvailability";
import { createRescheduleProposal } from "@/domain/calendar/scheduling/rescheduleEvent";
import { createScheduleProposal } from "@/domain/calendar/scheduling/scheduleEvent";
import { suggestAlternativeTimes } from "@/domain/calendar/scheduling/suggestAlternatives";
import type { CalendarEvent } from "@/domain/calendar/types";

type EventComposerProps = {
  colors: {
    text: string;
    mutedText: string;
    card: string;
    border: string;
    primary: string;
    background: string;
  };
  onEventIntent?: (event: {
    title: string;
    startAt: string;
    endAt: string;
    timezone: string;
    location?: string;
    description?: string;
    participant?: string;
  }) => void;
  onSchedule?: (event: CalendarEvent) => CalendarScheduleResult;
  onReschedule?: (
    existingEventId: string,
    proposedEvent: CalendarEvent,
  ) => CalendarRescheduleResult;
};

export default function EventComposer({
  colors,
  onEventIntent,
  onSchedule = scheduleCalendarEvent,
  onReschedule = rescheduleCalendarEvent,
}: EventComposerProps) {
  const [text, setText] = useState("");
  const [pendingRequest, setPendingRequest] = useState<string | null>(null);
  const [clarification, setClarification] = useState<string | null>(null);

  const [proposedEvent, setProposedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const [conflictEvent, setConflictEvent] = useState<CalendarEvent | null>(
    null,
  );

  const [alternatives, setAlternatives] = useState<CalendarEvent[]>([]);

  const [scheduled, setScheduled] = useState(false);

  const [rescheduleTarget, setRescheduleTarget] =
    useState<CalendarEvent | null>(null);

  const [rescheduling, setRescheduling] = useState(false);

  const [rescheduleMessage, setRescheduleMessage] = useState<string | null>(
    null,
  );

  const resetFlow = () => {
    setProposedEvent(null);
    setPendingRequest(null);
    setClarification(null);
    setConflictEvent(null);
    setAlternatives([]);
    setScheduled(false);
    setRescheduleTarget(null);
    setRescheduling(false);
    setRescheduleMessage(null);
  };

  const handleSubmit = () => {
    const currentText = text.trim();

    if (!currentText) {
      return;
    }

    const fullRequest = pendingRequest
      ? `${pendingRequest} ${currentText}`
      : currentText;

    const draft = parseEventInput(fullRequest);

    if (draft.intent === "reschedule") {
      const result = createRescheduleProposal(draft, getCalendarEvents());

      if (result.type === "clarification") {
        setPendingRequest(fullRequest);
        setClarification(result.message);
        setProposedEvent(null);
        setConflictEvent(null);
        setAlternatives([]);
        setRescheduleTarget(null);
        setRescheduleMessage(null);
        setText("");
        return;
      }

      if (result.type === "not_found") {
        setPendingRequest(null);
        setClarification(null);
        setProposedEvent(null);
        setConflictEvent(null);
        setAlternatives([]);
        setRescheduleTarget(null);
        setRescheduleMessage(result.message);
        setRescheduling(false);
        setScheduled(false);
        setText("");
        return;
      }

      const availability = checkAvailability(
        result.proposedEvent,
        getCalendarEvents().filter(
          (event) => event.id !== result.existingEvent.id,
        ),
      );

      if (!availability.available) {
        const suggestedAlternatives = suggestAlternativeTimes(
          result.proposedEvent,
          getCalendarEvents().filter(
            (event) => event.id !== result.existingEvent.id,
          ),
        );

        setPendingRequest(null);
        setClarification(null);
        setProposedEvent(result.proposedEvent);
        setConflictEvent(availability.conflict);
        setAlternatives(suggestedAlternatives);
        setRescheduleTarget(result.existingEvent);
        setRescheduling(true);
        setRescheduleMessage(null);
        setScheduled(false);
        setText("");
        return;
      }

      setPendingRequest(null);
      setClarification(null);
      setProposedEvent(result.proposedEvent);
      setConflictEvent(null);
      setAlternatives([]);
      setRescheduleTarget(result.existingEvent);
      setRescheduling(true);
      setRescheduleMessage(null);
      setScheduled(false);
      setText("");
      return;
    }

    const result = createScheduleProposal(draft);

    if (result.type === "clarification") {
      setPendingRequest(fullRequest);
      setClarification(result.message);
      setProposedEvent(null);
      setConflictEvent(null);
      setAlternatives([]);
      setRescheduleTarget(null);
      setRescheduling(false);
      setScheduled(false);
      setText("");
      return;
    }

    const event = result.event;
    const availability = checkAvailability(event, getCalendarEvents());

    if (!availability.available) {
      const suggestedAlternatives = suggestAlternativeTimes(
        event,
        getCalendarEvents(),
      );

      setPendingRequest(null);
      setClarification(null);
      setProposedEvent(null);
      setConflictEvent(availability.conflict);
      setAlternatives(suggestedAlternatives);
      setRescheduleTarget(null);
      setRescheduling(false);
      setScheduled(false);
      setText("");
      return;
    }

    onEventIntent?.({
      title: event.title,
      startAt: event.startAt,
      endAt: event.endAt,
      timezone: event.timezone,
      location: event.location,
      description: event.description,
      participant: draft.attendee,
    });

    setProposedEvent(event);
    setPendingRequest(null);
    setClarification(null);
    setConflictEvent(null);
    setAlternatives([]);
    setRescheduleTarget(null);
    setRescheduling(false);
    setText("");
    setScheduled(false);
    setRescheduleMessage(null);
  };

  const handleSelectAlternative = (event: CalendarEvent) => {
    const eventsForAvailability =
      rescheduling && rescheduleTarget
        ? getCalendarEvents().filter(
            (calendarEvent) => calendarEvent.id !== rescheduleTarget.id,
          )
        : getCalendarEvents();

    const availability = checkAvailability(event, eventsForAvailability);

    if (!availability.available) {
      setProposedEvent(null);
      setConflictEvent(availability.conflict);
      setAlternatives(suggestAlternativeTimes(event, eventsForAvailability));
      setScheduled(false);
      return;
    }

    setProposedEvent(event);
    setConflictEvent(null);
    setAlternatives([]);
    setScheduled(false);
  };

  const handleSchedule = () => {
    if (!proposedEvent || rescheduling || !onSchedule) {
      return;
    }

    const result = onSchedule(proposedEvent);

    if (!result.scheduled) {
      const currentEvents = getCalendarEvents();

      setProposedEvent(null);
      setConflictEvent(result.conflict);
      setAlternatives(
        result.conflict.id === proposedEvent.id
          ? []
          : suggestAlternativeTimes(proposedEvent, currentEvents),
      );
      setScheduled(false);
      return;
    }

    setScheduled(true);
    setProposedEvent(null);
  };

  const handleReschedule = () => {
    if (!proposedEvent || !rescheduleTarget || !onReschedule) {
      return;
    }

    const result = onReschedule(rescheduleTarget.id, proposedEvent);

    if (!result.rescheduled) {
      const currentEvents = getCalendarEvents().filter(
        (event) => event.id !== rescheduleTarget.id,
      );

      setConflictEvent(result.conflict);
      setAlternatives(suggestAlternativeTimes(proposedEvent, currentEvents));
      setScheduled(false);
      return;
    }

    setRescheduleMessage(
      `"${result.event.title}" was rescheduled successfully.`,
    );
    setProposedEvent(null);
    setConflictEvent(null);
    setAlternatives([]);
    setRescheduleTarget(null);
    setRescheduling(false);
    setScheduled(false);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]}>
        Schedule with AI{" "}
      </Text>

      <Text style={[styles.subtitle, { color: colors.mutedText }]}>
        Tell me what you want to schedule or reschedule.
      </Text>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="e.g. Meeting with Rahul tomorrow at 8 PM at the office"
        placeholderTextColor={colors.mutedText}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        multiline
        onSubmitEditing={handleSubmit}
      />

      {clarification ? (
        <View
          style={[
            styles.clarification,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.clarificationText, { color: colors.text }]}>
            {clarification}
          </Text>
        </View>
      ) : null}

      {rescheduleMessage ? (
        <View
          style={[
            styles.clarification,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.clarificationText, { color: colors.text }]}>
            {rescheduleMessage}
          </Text>
        </View>
      ) : null}

      <Pressable
        onPress={handleSubmit}
        style={[
          styles.primaryButton,
          {
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Text style={styles.primaryButtonText}>
          {rescheduling ? "Reschedule" : "Create Event"}
        </Text>
      </Pressable>

      {conflictEvent ? (
        <View
          style={[
            styles.conflictCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.conflictTitle, { color: colors.text }]}>
            {rescheduling ? "Reschedule conflict" : "Time conflict"}
          </Text>

          <Text style={[styles.conflictMessage, { color: colors.mutedText }]}>
            {rescheduling
              ? "The requested new time is already occupied."
              : "That time is already occupied."}
          </Text>

          <Text style={[styles.eventTitle, { color: colors.text }]}>
            {conflictEvent.title}
          </Text>

          <Text style={[styles.eventDetail, { color: colors.mutedText }]}>
            {new Date(conflictEvent.startAt).toLocaleString()} –{" "}
            {new Date(conflictEvent.endAt).toLocaleTimeString()}
          </Text>

          {conflictEvent.location ? (
            <Text style={[styles.eventDetail, { color: colors.mutedText }]}>
              {conflictEvent.location}
            </Text>
          ) : null}

          {alternatives.length > 0 ? (
            <View style={styles.alternatives}>
              <Text style={[styles.alternativesTitle, { color: colors.text }]}>
                {rescheduling
                  ? "Available reschedule times"
                  : "Available alternatives"}
              </Text>

              {alternatives.map((alternative) => (
                <Pressable
                  key={alternative.id}
                  onPress={() => handleSelectAlternative(alternative)}
                  style={[
                    styles.alternativeButton,
                    {
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[styles.alternativeText, { color: colors.text }]}
                  >
                    {new Date(alternative.startAt).toLocaleTimeString(
                      undefined,
                      {
                        hour: "numeric",
                        minute: "2-digit",
                      },
                    )}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text style={[styles.conflictMessage, { color: colors.mutedText }]}>
              I couldn't find another available time in the suggested window.
            </Text>
          )}

          <Pressable
            onPress={resetFlow}
            style={[
              styles.secondaryButton,
              {
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.secondaryText, { color: colors.text }]}>
              Cancel
            </Text>
          </Pressable>
        </View>
      ) : null}

      {proposedEvent ? (
        <View
          style={[
            styles.proposalCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.proposalTitle, { color: colors.text }]}>
            {rescheduling ? "Confirm reschedule" : "Confirm event"}
          </Text>

          <Text style={[styles.availableText, { color: colors.primary }]}>
            Time is available
          </Text>

          {rescheduling && rescheduleTarget ? (
            <Text style={[styles.eventDetail, { color: colors.mutedText }]}>
              Moving from {new Date(rescheduleTarget.startAt).toLocaleString()}
            </Text>
          ) : null}

          <Text style={[styles.eventTitle, { color: colors.text }]}>
            {proposedEvent.title}
          </Text>

          <Text style={[styles.eventDetail, { color: colors.mutedText }]}>
            {new Date(proposedEvent.startAt).toLocaleString()}
          </Text>

          {proposedEvent.location ? (
            <Text style={[styles.eventDetail, { color: colors.mutedText }]}>
              {proposedEvent.location}
            </Text>
          ) : null}

          {proposedEvent.description ? (
            <Text style={[styles.eventDetail, { color: colors.mutedText }]}>
              {proposedEvent.description}
            </Text>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              onPress={resetFlow}
              style={[
                styles.secondaryButton,
                {
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.secondaryText, { color: colors.text }]}>
                Cancel
              </Text>
            </Pressable>

            {rescheduling ? (
              <Pressable
                onPress={handleReschedule}
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Text style={styles.primaryButtonText}>Reschedule</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleSchedule}
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Text style={styles.primaryButtonText}>Schedule</Text>
              </Pressable>
            )}
          </View>
        </View>
      ) : null}

      {scheduled ? (
        <Text style={[styles.success, { color: colors.primary }]}>
          Scheduled successfully.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
  },
  input: {
    minHeight: 90,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlignVertical: "top",
    fontSize: 15,
  },
  clarification: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  clarificationText: {
    fontSize: 14,
  },
  primaryButton: {
    minHeight: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  conflictCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  conflictTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  conflictMessage: {
    fontSize: 14,
  },
  alternatives: {
    gap: 8,
    marginTop: 8,
  },
  alternativesTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  alternativeButton: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  alternativeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  proposalCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  proposalTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  availableText: {
    fontSize: 14,
    fontWeight: "600",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  eventDetail: {
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  secondaryButton: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "600",
  },
  success: {
    fontSize: 14,
    fontWeight: "600",
  },
});
