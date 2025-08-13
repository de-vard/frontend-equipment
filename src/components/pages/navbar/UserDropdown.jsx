// components/UserDropdown.jsx
// components/navbar/UserDropdown.jsx
import React, { useState } from "react";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";
import EndeetKeySetup from "../../endeet/EndeetKeySetup";

function UserDropdown({ user, handleLogout }) {
    const [showEndeetModal, setShowEndeetModal] = useState(false);

    return (
        <>
            <NavDropdown
                title={`${user.last_name} ${user.first_name[0]}.${user.middle_name[0]}.`}
                id="collapsible-nav-dropdown"
            >
                <NavDropdown.Item onClick={() => setShowEndeetModal(true)}>
                    Endeet Key
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                    Выход
                </NavDropdown.Item>
            </NavDropdown>

            <EndeetKeySetup 
                show={showEndeetModal} 
                onHide={() => setShowEndeetModal(false)} 
            />
        </>
    );
}

export default UserDropdown;







// import React from "react";
// import NavDropdown from 'react-bootstrap/NavDropdown';
// import { Link } from "react-router-dom";

// function UserDropdown({ user, handleLogout }) {
//     return (
//         <NavDropdown
//             title={`${user.last_name} ${user.first_name[0]}.${user.middle_name[0]}.`}
//             id="collapsible-nav-dropdown"
//         >
//             <NavDropdown.Item as={Link} to="/profile">
//                 Endeet Key
//             </NavDropdown.Item>
//             <NavDropdown.Divider />
//             <NavDropdown.Item onClick={handleLogout}>
//                 Выход
//             </NavDropdown.Item>
//         </NavDropdown>
//     );
// }

// export default UserDropdown;