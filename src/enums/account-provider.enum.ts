export const providerEnum = {
    GOOGLE: "GOOGLE",
    GITHUB: "GITHUB",
    FACEBOOK: "FACEBOOK",
    EMAIL: "EMAIL"
}

export type accountProviderEnumType = keyof typeof providerEnum;