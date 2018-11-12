export interface ISyntheticNode {
  readonly name: string;
  readonly parent?: ISyntheticNode | null;
}
export interface ISyntheticEvent {
  readonly type: string;
  readonly target: ISyntheticNode;
}

export interface IEventHandler {
  (e: Event): any;
}
