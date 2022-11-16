


export type Value = boolean | boolean[] | ConfigValue;

export type ConfigValue = string | number | string[] | number[]
export interface EnvValue {
    qa: Value;
    // stage: Value;
    // prod: Value;
    // demo: Value;
    // 'demo-qa': Value;
    // test: Value;
    // 'ireland-stage': Value;
    // ireland: Value;
    // 'okta-qa': Value;
}
export interface Config {
    id: string;
    description: string;
    value: EnvValue; //Record<Env,Value>;
    createdOn: number;
    updatedOn: number;
    type: Value;
    createdBy: string;
    updatedBy: string;
}
export type CreateConfig = Omit<Config, "updatedOn" | "updatedBy">;

export type UpdateConfig = Omit<Config, "id" | "type" | "createdOn" | "createdBy">;