// this function retrieves an environment variable by its key
export const getEnv = (key: string, defaultValue: string): string => {
    const value = process.env[key];
    if (value === undefined) {
        if (defaultValue) {
            return defaultValue;
        }
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
}