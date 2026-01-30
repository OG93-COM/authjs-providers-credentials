export type ActionTypes = {
    success : boolean;
    message : string;
}

export type LoginType = ActionTypes & { twoStep?: boolean }