import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    Delete,
} from "@nestjs/common";
import { CalendarService } from "./calendar.service";
import { CreateCalendarDto } from "./dto/create-calendar.dto";
import { UpdateCalendarEventDto } from "./dto/update-calendar.dto";
import { GetEventsDto } from "./dto/get-events.dto";
import { DeleteEventDto } from "./dto/delete-event.dto";

@Controller("calendar")
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) {}

    @Post("event")
    create(@Body() dto: CreateCalendarDto) {
        return this.calendarService.create(dto);
    }

    @Get("events")
    findAll(@Query() dto: GetEventsDto) {
        return this.calendarService.findAll(dto);
    }

    @Delete("event")
    delete(@Body() dto: DeleteEventDto) {
        return this.calendarService.delete(dto);
    }

    @Patch(":calendarId/events/:eventId")
    updateEvent(
        @Param("calendarId") calendarId: string,
        @Param("eventId") eventId: string,
        @Body() dto: UpdateCalendarEventDto
    ) {
        return this.calendarService.updateEvent(dto, calendarId, eventId);
    }
}
