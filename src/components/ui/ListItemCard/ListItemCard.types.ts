export interface ListItemCardProps {
  icon?: React.ReactNode;
  iconWrapperClassName?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  rightDetail?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
