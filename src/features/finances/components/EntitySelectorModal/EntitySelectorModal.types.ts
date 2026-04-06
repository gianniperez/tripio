import { LinkableEntity } from "../../hooks/useLinkableEntities";

export interface EntitySelectorModalProps {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (entity: LinkableEntity) => void;
}
