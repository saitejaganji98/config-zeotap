export interface ConfigValue {
    qa: boolean;
}

export interface Config {
    id: string;
    description: string;
    value: ConfigValue;
    createdOn: string;
    updatedOn: string;
}
export type CreateConfig = Omit<Config, "updatedOn">;

export type UpdateConfig = Omit<Config, "id" | "createdOn">;