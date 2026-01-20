
export const MOCK_USERS = [
    {
        id: 1,
        employee_id: "EMP001",
        user_name: "Am Sir",
        username: "Am Sir",
        department: "Director",
        designation: "Managing Director",
        location: "Raipur, CG",
        joining_date: "Jan 2015",
        shift: "General Shift",
        role: "admin",
        number: "+91 99815 17979",
        email_id: "dram@sbhhospital.com",
        status: "active",
        system_access: "CHECKLIST & DELEGATION,HRMS, DOCUMENT & SUBSRIPTION, MAINTENANCE MODULE,PAYMENT FMS"
    },
    {
      id: 2,
      employee_id: "EMP002",
      user_name: "Jharna Ambulkar",
      department: "Admin Department",
      designation: "Process Coordinator",
      location: "Raipur, CG",
      joining_date: "Mar 2021",
      shift: "Morning Shift",
      role: "user",
      number: "+91 91796 36600",
      email_id: "admin.executive@sbhhospital.com",
      status: "active",
      system_access: "CHECKLIST & DELEGATION"
  },
    {
      id: 3,
      employee_id: "EMP003",
      user_name: "Geetanjali Deep",
      department: "HR Department",
      designation: "HR",
      location: "Raipur, CG",
      joining_date: "Mar 2021",
      shift: "Morning Shift",
      role: "user",
      number: "+91 96444 92116",
      email_id: "hr@sbhhospital.com",
      status: "active",
      system_access: "HRMS"
  }
];

export const MOCK_SYSTEMS = [
    { id: 1, systems: "CHECKLIST & DELEGATION", link: "https://new-checklist-deleagtion.vercel.app/" },
    { id: 2, systems: "HRMS", link: "https://sbh-hr-fms.vercel.app/" },
    { id: 3, systems: "DOCUMENT & SUBSRIPTION", link: "https://document-subscription.vercel.app/"},
    { id: 4, systems: "MAINTENANCE MODULE", link: "https://maintenance-module.vercel.app/" },
    { id: 5, systems: "PAYMENT FMS", link: "https://payment-fms.vercel.app/" }
];

// Mock API Functions
export const fetchUserDetailsApi = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...MOCK_USERS]), 500);
    });
};

export const fetchSystemsApi = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...MOCK_SYSTEMS]), 500);
    });
};

export const fetchAttendanceSummaryApi = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({
            data: {
                data: [
                    { employee_id: "EMP001", status: "IN", monthly_attendance: 20 },
                    { employee_id: "EMP002", status: "OUT", monthly_attendance: 18 },
                    { employee_id: "EMP003", status: "IN", monthly_attendance: 22 },
                ]
            }
        }), 500);
    });
};

export const patchSystemAccessApi = async (data) => {
    console.log("Mock patchSystemAccessApi called with:", data);
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300));
};

export const createSystemApi = async (data) => {
    console.log("Mock createSystemApi called with:", data);
    MOCK_SYSTEMS.push({ id: Date.now(), ...data });
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300));
};

export const updateSystemApi = async (id, data) => {
    console.log("Mock updateSystemApi called with:", id, data);
    const index = MOCK_SYSTEMS.findIndex(s => s.id === id);
    if (index !== -1) {
        MOCK_SYSTEMS[index] = { ...MOCK_SYSTEMS[index], ...data };
    }
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300));
};

export const deleteSystemApi = async (id) => {
    console.log("Mock deleteSystemApi called with:", id);
    const index = MOCK_SYSTEMS.findIndex(s => s.id === id);
    if (index !== -1) {
        MOCK_SYSTEMS.splice(index, 1);
    }
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300));
};
