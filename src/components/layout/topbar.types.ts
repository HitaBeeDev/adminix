export interface BreadcrumbItem {
  label: string;
  path: string;
}

export interface TopbarNotification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
}
