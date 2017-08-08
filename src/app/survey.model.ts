export class Survey {
    id: number;
    title: string;
    lastAction: Date;
    options: Option[];
}

export class Option {
    id: number;
    title: string;
}

export class TransferObject {
    recipient: string;
    operationData: any;
}
