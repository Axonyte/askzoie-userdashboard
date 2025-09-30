import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
            clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
            callbackURL: configService.get<string>("GOOGLE_AUTH_CALLBACK_URL"),
            scope: [
                "email",
                "profile",
                "https://www.googleapis.com/auth/calendar",
            ],
        });
    }

    // ✅ Force refreshToken every time
    authorizationParams(): { [key: string]: string } {
        return {
            access_type: "offline", // ensures refreshToken is issued
            prompt: "consent", // forces re-consent so refreshToken is returned
        };
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ): Promise<any> {
        const { name, emails, photos } = profile;

        const user = {
            email: emails[0].value,
            firstName: name?.givenName,
            lastName: name?.familyName,
            picture: photos[0]?.value,
            accessToken,
            refreshToken, // ✅ will no longer be undefined
        };

        done(null, user);
    }
}
