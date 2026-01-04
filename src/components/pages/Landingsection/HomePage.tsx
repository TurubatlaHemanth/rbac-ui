import React from "react";
import SideNavBar from "./SideNavBar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

function HomePage() {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* LEFT SIDEBAR */}
      <aside
        style={{
          width: "260px",
          backgroundColor: "#f7f7f8",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* SIDEBAR HEADER */}
        <div
          style={{
            padding: "15px",
            fontWeight: "bold",
            fontSize: "18px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton onClick={() => setOpen(true)}>
            <MenuOpenIcon />
          </IconButton>
        </div>

        {/* DRAWER COMPONENT */}
        <SideNavBar open={open} setOpen={setOpen} />

        {/* SIDEBAR CONTENT (optional) */}
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "10px",
          }}
        ></div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* TOP HEADER */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: "#fff",
            borderBottom: "1px solid #ddd",
            height: "60px",
          }}
        >
          <div style={{ marginLeft: "auto" }}>
            <AccountCircleIcon style={{ fontSize: 32 }} />
          </div>
        </header>

        {/* MAIN PAGE CONTENT */}
        <main
          style={{
            padding: "20px",
            overflowY: "auto",
            flexGrow: 1,
          }}
        >
          <h1>Home Page</h1>
          <p>Here is the main content of the page, other data...</p>
        </main>
      </div>
    </div>
  );
}

export default HomePage;
