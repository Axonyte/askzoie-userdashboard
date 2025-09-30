import { ForbiddenException, Injectable } from "@nestjs/common";
import { google } from "googleapis";
import { PrismaService } from "src/shared/services/prisma/prisma.service";
import { UpdateCalendarEventDto } from "./dto/update-calendar.dto";
import { GetEventsDto } from "./dto/get-events.dto";
import { CreateCalendarDto } from "./dto/create-calendar.dto";
import { DeleteEventDto } from "./dto/delete-event.dto";

@Injectable()
export class CalendarService {
    constructor(private readonly prisma: PrismaService) {}

    private async getUserTokens(userId: string) {
        const tokens = await this.prisma.googleToken.findUnique({
            where: { userId },
        });
        if (!tokens) {
            throw new ForbiddenException(
                "Your Google Calendar cannot be accessed. Please connect your Google account in the dashboard."
            );
        }
        return tokens;
    }

    private async getAuthClient(userId: string) {
        // 🔑 Fetch user tokens from DB
        const tokens = await this.getUserTokens(userId);
        const { accessToken, refreshToken } = tokens;

        if (!refreshToken) {
            throw new ForbiddenException(
                "Google Calendar refresh token missing"
            );
        }

        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_AUTH_CALLBACK_URL
        );

        oAuth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        return oAuth2Client;
    }

    // ✅ Create Event
    async create(dto: CreateCalendarDto) {
        const auth = await this.getAuthClient(dto.userId);
        const calendar = google.calendar({ version: "v3", auth });

        const res = await calendar.events.insert({
            calendarId: "primary",
            requestBody: {
                summary: dto.summary,
                description: dto.description,
                location: dto.location,
                start: { dateTime: dto.startDateTime, timeZone: dto.timeZone },
                end: { dateTime: dto.endDateTime, timeZone: dto.timeZone },
                attendees: dto.attendees,
            },
        });

        return res.data;
    }

    // ✅ List Events
    async findAll(dto: GetEventsDto) {
        const auth = await this.getAuthClient(dto.userId);
        const calendar = google.calendar({ version: "v3", auth });

        const res = await calendar.events.list({
            calendarId: "primary",
            timeMin: dto.startDate
                ? new Date(dto.startDate).toISOString()
                : undefined,
            timeMax: dto.endDate
                ? new Date(dto.endDate).toISOString()
                : undefined,
            singleEvents: true,
            orderBy: "startTime",
        });

        return res.data.items;
    }

    // ✅ Update Event
    async updateEvent(
        dto: UpdateCalendarEventDto,
        calendarId: string,
        eventId: string
    ) {
        const auth = await this.getAuthClient(dto.userId);
        const calendar = google.calendar({ version: "v3", auth });

        const res = await calendar.events.update({
            calendarId,
            eventId,
            requestBody: {
                summary: dto.summary,
                description: dto.description,
                start: dto.startDateTime
                    ? { dateTime: dto.startDateTime }
                    : undefined,
                end: dto.endDateTime
                    ? { dateTime: dto.endDateTime }
                    : undefined,
                location: dto.location,
            },
        });

        return res.data;
    }

    // ✅ Delete Event
    async delete(dto: DeleteEventDto) {
        const auth = await this.getAuthClient(dto.userId);
        const calendar = google.calendar({ version: "v3", auth });

        await calendar.events.delete({
            calendarId: "primary",
            eventId: dto.eventId,
        });

        return { success: true, message: "Event deleted successfully" };
    }
}
