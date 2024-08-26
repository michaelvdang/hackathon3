import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText } from '@mui/material';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  conversationList: string[];
  onSelect: (id: string) => void;
}

export const ConversationDialog: React.FC<DialogProps> = ({ open, onClose, conversationList, onSelect }) => {
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select a Conversation</DialogTitle>
      <DialogContent>
        <List>
          {conversationList.map((id) => (
            <ListItem button key={id} onClick={() => onSelect(id)}>
              <ListItemText primary={id} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}