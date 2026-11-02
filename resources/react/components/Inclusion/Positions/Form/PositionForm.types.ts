/** Payload enviado a `PositionController@store/update` (ver `Application/Data/Positions`). */
export type PositionFormData = {
    name: string;
    description: string;
    is_active: boolean;
    permissions: number[];
};
