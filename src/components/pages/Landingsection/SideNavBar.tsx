import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

type SideNavBarProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function SideNavBar({ open, setOpen }: SideNavBarProps) {
  const handleClose = () => setOpen(false);

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          padding: "10px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={handleClose}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      variant="temporary"
      ModalProps={{ keepMounted: true }}
    >
      {DrawerList}
    </Drawer>
  );
}

export default SideNavBar;
