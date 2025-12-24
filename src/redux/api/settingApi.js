// ============================================
// DUMMY FRONTEND - HARDCODED USER DATA
// No backend connection required
// ============================================

// Hardcoded Users Data
let HARDCODED_USERS = [
    {
        id: 1,
        employee_id: "EMP001",
        user_name: "Admin User",
        role: "admin",
        department: "Management",
        email_id: "admin@example.com",
        number: "+91 98765 43210",
        status: "active",
        system_access: "Purchase FMS,Production Planning,Store FMS,Checklist Delegation,HR Product,Maintenance,MIS Dashboard,Repair Management,Subscription Manager,Document Manager"
    },
    {
        id: 2,
        employee_id: "EMP002",
        user_name: "Regular User",
        role: "user",
        department: "Operations",
        email_id: "user@example.com",
        number: "+91 98765 43211",
        status: "active",
        system_access: "Maintenance,MIS Dashboard,Checklist Delegation"
    },
    {
        id: 3,
        employee_id: "EMP003",
        user_name: "John Doe",
        role: "user",
        department: "Production",
        email_id: "john@example.com",
        number: "+91 98765 43212",
        status: "active",
        system_access: "Production Planning,Maintenance"
    },
    {
        id: 4,
        employee_id: "EMP004",
        user_name: "Jane Smith",
        role: "user",
        department: "HR",
        email_id: "jane@example.com",
        number: "+91 98765 43213",
        status: "active",
        system_access: "HR Product,Document Manager"
    },
    {
        id: 5,
        employee_id: "EMP005",
        user_name: "Mike Johnson",
        role: "user",
        department: "Sales",
        email_id: "mike@example.com",
        number: "+91 98765 43214",
        status: "inactive",
        system_access: "Lead to Order,Retail Management"
    }
];

/**
 * GET all users (returns hardcoded data)
 */
export const fetchUserDetailsApi = async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return HARDCODED_USERS;
};

/**
 * DELETE user by ID
 */
export const deleteUserByIdApi = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    HARDCODED_USERS = HARDCODED_USERS.filter(u => u.id !== id);
    return { success: true };
};

/**
 * UPDATE user data
 */
export const updateUserDataApi = async ({ id, updatedUser }) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = HARDCODED_USERS.findIndex(u => u.id === id);
    if (index !== -1) {
        HARDCODED_USERS[index] = { ...HARDCODED_USERS[index], ...updatedUser };
        return HARDCODED_USERS[index];
    }
    return null;
};

/**
 * PATCH system_access
 */
export const patchSystemAccessApi = async ({ id, system_access }) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = HARDCODED_USERS.findIndex(u => u.id === id);
    if (index !== -1) {
        const currentAccess = HARDCODED_USERS[index].system_access || "";
        const accessArray = currentAccess.split(",").filter(Boolean);

        // Toggle: if exists, remove. If not, add.
        if (accessArray.includes(system_access)) {
            HARDCODED_USERS[index].system_access = accessArray
                .filter(a => a !== system_access)
                .join(",");
        } else {
            accessArray.push(system_access);
            HARDCODED_USERS[index].system_access = accessArray.join(",");
        }

        return HARDCODED_USERS[index];
    }
    return null;
};