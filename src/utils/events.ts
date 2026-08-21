/**
 * Build an SDK event listener that logs the event's `detail` payload under
 * `name`. SDK events are DOM `CustomEvent`s whose payload lives on `.detail`.
 */
export function logEvent(name: string) {
  return (event: Event) => {
    console.log(name, (event as CustomEvent).detail);
  };
}
