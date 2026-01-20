export const USERS = [
    {
        user_name: "Am Sir",
        username: "Am Sir",
        password: "Am123",
        role: "admin",
        email_id: "admin@example.com",
        system_access: "CHECKLIST & DELEGATION,HRMS",
    },
    {
        user_name: "Jharna Ambulkar",
        username: "Jharna Ambulkar",
        password: "Jharna@123",
        role: "user",
        email_id: "admin.executive@sbhhospital.com",
        mobile_number: "91796 36600",
        system_access: "CHECKLIST & DELEGATION",
    },
    {
        user_name: "GEETANJALI DEEP",
        username: "GEETANJALI DEEP",
        password: "GEETANJALI@123",
        role: "user",
        email_id: "hr@sbhhospital.com",
        mobile_number: "96444 92116",
        system_access: "HRMS",
    },
];

export const login = (usernameInput, passwordInput) => {
    const normalizedUsername = usernameInput.trim().toLowerCase();

    const user = USERS.find(
        (u) =>
            u.username.toLowerCase() === normalizedUsername &&
            u.password === passwordInput
    );

    if (user) {
        // Return a copy without the password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
};

export const logout = () => {
    localStorage.removeItem("user-name");
    localStorage.removeItem("activeRoute");
    localStorage.removeItem("currentUrl");
    localStorage.removeItem("system_access");
    localStorage.removeItem("role");
    localStorage.removeItem("email_id");
    sessionStorage.clear();
};
