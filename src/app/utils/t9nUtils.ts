export function getMessageBundlePath(componentName: string): string {
  return `${import.meta.env.BASE_URL}assets/t9n/${componentName}/resources`;
}
