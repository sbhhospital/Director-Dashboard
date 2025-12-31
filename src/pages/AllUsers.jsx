import { useState, useEffect } from "react"
import { Award, Target, MapPin, Briefcase, Calendar, Layers, Clock } from "lucide-react";
import searchIcon from "../assets/search-icon-logo.png";
import { fetchUserDetailsApi, fetchSystemsApi, fetchAttendanceSummaryApi, patchSystemAccessApi } from "../api";

const HomePage = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [systemsList, setSystemsList] = useState([]);
    const [attendance, setAttendance] = useState(null);
    const [attendanceFilter, setAttendanceFilter] = useState("");


    const handleSystemAccessPatch = async (id, value) => {
        if (!value.trim()) return;

        await patchSystemAccessApi({
            id: id,
            system_access: value, // append handled in backend
        });

        // refresh users list after patch
        const users = await fetchUserDetailsApi();
        setAllUsers(users);
    };


    const DUMMY_USERS = [
        {
            id: 1,
            employee_id: "EMP001",
            user_name: "Admin User",
            department: "Director",
            designation: "Managing Director",
            location: "Raipur, CG",
            joining_date: "Jan 2015",
            shift: "General Shift",
            role: "admin",
            number: "+91 99815 17979",
            email_id: "dram@sbhhospital.com",
            status: "active",
            system_access: "CHECKLIST & DELEGATION,HRMS,DOCUMENT MANAGER,MAINTENANCE MODULE,SUBSCRIPTION MANAGER,PAYMENT FMS"
        },
        {
            id: 2,
            employee_id: "EMP002",
            user_name: "John Doe",
            department: "IT",
            designation: "IT Manager",
            location: "Raipur, CG",
            joining_date: "Jun 2018",
            shift: "General Shift",
            role: "user",
            number: "+91 98765 43211",
            email_id: "john.doe@example.com",
            status: "active",
            system_access: "CHECKLIST & DELEGATION"
        },
        {
            id: 3,
            employee_id: "EMP003",
            user_name: "Jane Smith",
            department: "HR",
            designation: "HR Executive",
            location: "Raipur, CG",
            joining_date: "Sep 2020",
            shift: "Morning Shift",
            role: "user",
            number: "+91 98765 43212",
            email_id: "jane.smith@sourabhrollingmills.com",
            status: "active",
            system_access: "HRMS"
        }
    ];

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                setLoading(true);

                const storedUsername = localStorage.getItem("user-name");

                const usersRes = await fetchUserDetailsApi();
                // Use dummy data if API returns empty
                const users = Array.isArray(usersRes) && usersRes.length > 0 ? usersRes : DUMMY_USERS;
                setAllUsers(users);

                const systemsData = await fetchSystemsApi();
                setSystemsList(Array.isArray(systemsData) ? systemsData : []);

                // If no stored username, defaulting to admin for demo if needed, or just return
                if (!storedUsername) {
                    // For demo purposes, if no user is logged in context (which shouldn't happen in protected route), 
                    // we could force one, but let's stick to logic. 
                    // However, if the user logged in as 'admin' (which is in local storage), we find them in dummy list if strictly matching.
                }

                const matchedUser = users.find(
                    (u) =>
                        u?.user_name?.toLowerCase() === (storedUsername?.toLowerCase() || "admin user")
                );

                // Fallback to first user if no match found (for demo safety)
                setUserDetails(matchedUser || users[0]);

                if (matchedUser) {
                    localStorage.setItem(
                        "system_access",
                        JSON.stringify(
                            (matchedUser?.system_access || "")
                                .split(",")
                                .map((v) => v.trim().toUpperCase())
                                .filter(Boolean)
                        )
                    );
                }


                const attendanceRes = await fetchAttendanceSummaryApi();
                const attendanceList = Array.isArray(attendanceRes?.data?.data)
                    ? attendanceRes.data.data
                    : [];

                setAttendance(attendanceList);

                if (matchedUser?.employee_id) {
                    const matchedAttendance = attendanceList.find(
                        (a) =>
                            String(a.employee_id).trim() ===
                            String(matchedUser.employee_id).trim()
                    );
                    setAttendance(matchedAttendance || null);
                }
            } catch (error) {
                console.error("Error fetching employee details:", error);
                // Fallback to dummy data on error
                setAllUsers(DUMMY_USERS);
                setUserDetails(DUMMY_USERS[0]);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeDetails();
    }, []);

    const attendanceMap = Array.isArray(attendance)
        ? attendance.reduce((acc, a) => {
            acc[String(a.employee_id).trim()] = a.status;
            return acc;
        }, {})
        : {};

    const filteredUsers = allUsers.filter((u) => {
        if (u.role === "admin") return false;

        const matchesSearch =
            u.employee_id?.toString().includes(search) ||
            u.user_name?.toLowerCase().includes(search.toLowerCase());

        const matchesDept =
            departmentFilter === "" || u.department === departmentFilter;

        const attendanceStatus =
            attendanceMap[u.employee_id] === "IN" ? "present" : "absent";

        const matchesAttendance =
            attendanceFilter === "" || attendanceFilter === attendanceStatus;

        return matchesSearch && matchesDept && matchesAttendance;
    });

    return (
        <div className="w-full">
            <section className="py-4 md:py-4 bg-transparent">
                <div className="container mx-auto px-4 md:px-8">
                    {localStorage.getItem("user-name")?.toLowerCase() !== "admin" && (
                        <div>
                            <div className="grid grid-cols md:grid-cols">
                                {/* Employee Card - Dynamic based on API data */}
                                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl mb-8">
                                    {/* Decorative Header Banner */}
                                    <div className="h-32 bg-gradient-to-r from-blue-200 via-sky-blue-400 to-green-300 relative">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-5 -mb-5"></div>
                                    </div>

                                    <div className="px-8 pb-8">
                                        <div className="flex flex-col md:flex-row gap-8 items-start -mt-12">
                                            {/* Avatar Section */}
                                            <div className="flex-shrink-0 mx-auto md:mx-0 relative group">
                                                <div className="w-32 h-32 rounded-full p-1 bg-white shadow-lg ring-4 ring-white group-hover:scale-105 transition-transform duration-300">
                                                    <img
                                                        src={
                                                            userDetails?.employee_id
                                                                ? `/am sir.jpg`
                                                                : "/user.png"
                                                        }
                                                        alt="Employee"
                                                        className="w-full h-full rounded-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = "/user.png";
                                                        }}
                                                    />
                                                </div>
                                                <div className={`absolute bottom-2 right-2 w-5 h-5 border-4 border-white rounded-full shadow-sm ${userDetails?.status === "active" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
                                            </div>

                                            {/* Info Section */}
                                            <div className="flex-1 mt-4 md:mt-12 w-full text-center md:text-left">
                                                {loading ? (
                                                    <div className="space-y-3 animate-pulse">
                                                        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto md:mx-0"></div>
                                                        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto md:mx-0"></div>
                                                    </div>
                                                ) : userDetails ? (
                                                    <div>
                                                        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6">
                                                            <div>
                                                                <h3 className="text-3xl font-bold text-gray-800 tracking-tight">
                                                                    {userDetails.user_name || "N/A"}
                                                                </h3>
                                                                <p className="text-sky-600 font-medium text-lg">{userDetails.department || "Department N/A"}</p>
                                                            </div>
                                                            <span className={`mt-3 md:mt-0 px-4 py-1.5 rounded-full text-sm font-semibold border shadow-sm ${userDetails.status === "active"
                                                                ? "bg-green-50 text-green-700 border-green-200"
                                                                : "bg-red-50 text-red-700 border-red-200"
                                                                }`}>
                                                                {userDetails.status || "N/A"}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-sm">
                                                            {/* Designation */}
                                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-orange-50 hover:border-orange-100 transition-all group">
                                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                                                    <Briefcase className="w-5 h-5" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Designation</p>
                                                                    <p className="font-bold text-gray-800">{userDetails.designation || "N/A"}</p>
                                                                </div>
                                                            </div>

                                                            {/* Location */}
                                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-indigo-50 hover:border-indigo-100 transition-all group">
                                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                                                    <MapPin className="w-5 h-5" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Location</p>
                                                                    <p className="font-bold text-gray-800">{userDetails.location || "Raipur, CG"}</p>
                                                                </div>
                                                            </div>

                                                            {/* Joining Date */}
                                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-pink-50 hover:border-pink-100 transition-all group">
                                                                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                                                                    <Calendar className="w-5 h-5" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Joined</p>
                                                                    <p className="font-bold text-gray-800">{userDetails.joining_date || "N/A"}</p>
                                                                </div>
                                                            </div>

                                                            {/* Email */}
                                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-purple-50 hover:border-purple-100 transition-all group">
                                                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Email</p>
                                                                    <p className="font-bold text-gray-800 break-all" title={userDetails.email_id || "N/A"}>{userDetails.email_id || "N/A"}</p>
                                                                </div>
                                                            </div>

                                                            {/* Contact */}
                                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-green-50 hover:border-green-100 transition-all group">
                                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Contact</p>
                                                                    <p className="font-bold text-gray-800">{userDetails.number || "N/A"}</p>
                                                                </div>
                                                            </div>

                                                            {/* System Access Count */}
                                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-cyan-50 hover:border-cyan-100 transition-all group">
                                                                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                                                                    <Layers className="w-5 h-5" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Systems</p>
                                                                    <p className="font-bold text-gray-800">{userDetails.system_access ? userDetails.system_access.split(',').length : 0} Apps</p>
                                                                </div>
                                                            </div>

                                                            {/* Shift */}
                                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-yellow-50 hover:border-yellow-100 transition-all group">
                                                                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
                                                                    <Clock className="w-5 h-5" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Shift</p>
                                                                    <p className="font-bold text-gray-800">{userDetails.shift || "General"}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Employee Details</h3>
                                                        <p className="text-gray-600">Unable to load employee information</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {localStorage.getItem("user-name")?.toLowerCase() === "admin" && (
                        <div className="w-full">
                            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden p-4 md:p-6">
                                <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
                                    All Users ({filteredUsers.length})
                                </h1>

                                {allUsers.length === 0 ? (
                                    <p className="text-gray-600">No users found...</p>
                                ) : (
                                    <><div className="flex flex-col-2 md:flex-row gap-4 mb-4">

                                        {/* Search Box */}
                                        <div className="relative w-full md:w-1/3">
                                            <input
                                                type="text"
                                                placeholder="Search by Employee ID or Username..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                            />
                                            <img
                                                src={searchIcon}
                                                alt="Search"
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                            />
                                        </div>

                                        {/* Department Dropdown */}
                                        <select
                                            value={departmentFilter}
                                            onChange={(e) => setDepartmentFilter(e.target.value)}
                                            className="w-full md:w-1/4 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                        >
                                            <option value="">All Departments</option>
                                            {[...new Set(allUsers.map((u) => u.department))].map((dept) => (
                                                <option key={dept} value={dept}>
                                                    {dept}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={attendanceFilter}
                                            onChange={(e) => setAttendanceFilter(e.target.value)}
                                            className="w-full md:w-1/4 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                        >
                                            <option value="">All Attendance</option>
                                            <option value="present">Present</option>
                                            <option value="absent">Absent</option>
                                        </select>
                                    </div>
                                        <div className="relative max-h-[65vh] overflow-y-auto overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                                            <table className="min-w-full text-sm">
                                                {/* HEADER */}
                                                <thead className="sticky top-0 z-10 bg-gradient-to-r from-gray-50 to-gray-100 backdrop-blur border-b">
                                                    <tr>
                                                        {[
                                                            "Employee ID",
                                                            "Username",
                                                            "Department",
                                                            "Attendance",
                                                            "Contact",
                                                            "System Access",
                                                            "Status",
                                                        ].map((h) => (
                                                            <th
                                                                key={h}
                                                                className="px-4 py-3 text-left font-semibold text-gray-700 tracking-wide uppercase text-xs"
                                                            >
                                                                {h}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>

                                                {/* BODY */}
                                                <tbody className="divide-y divide-gray-100">
                                                    {filteredUsers.map((user, idx) => (
                                                        <tr
                                                            key={user.id}
                                                            className={`transition ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                                                                } hover:bg-sky-50`}
                                                        >
                                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                                {user.employee_id}
                                                            </td>

                                                            <td className="px-4 py-3 text-gray-700">
                                                                {user.user_name}
                                                            </td>

                                                            <td className="px-4 py-3 text-gray-600">
                                                                {user.user_access}
                                                            </td>

                                                            <td className="px-4 py-3">
                                                                {attendanceMap[user.employee_id] === "IN" ? (
                                                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
                                                                        Present
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-700">
                                                                        Absent
                                                                    </span>
                                                                )}
                                                            </td>

                                                            <td className="px-4 py-3 text-gray-600">
                                                                {user.number}
                                                            </td>

                                                            {/* SYSTEM ACCESS */}
                                                            <td className="px-4 py-3">
                                                                <select
                                                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs
                           focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                                                    defaultValue=""
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        if (!value) return;
                                                                        handleSystemAccessPatch(user.id, value);
                                                                        e.target.value = "";
                                                                    }}
                                                                >
                                                                    <option value="">Add system access</option>
                                                                    {systemsList.map((sys) => (
                                                                        <option key={sys.id} value={sys.systems}>
                                                                            {sys.systems}
                                                                        </option>
                                                                    ))}
                                                                </select>

                                                                <div className="mt-2 flex flex-wrap gap-1.5">
                                                                    {user.system_access?.split(",").map((access) => (
                                                                        <span
                                                                            key={access}
                                                                            className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                                                                        >
                                                                            {access}
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleSystemAccessPatch(user.id, access)
                                                                                }
                                                                                className="text-red-500 hover:text-red-700"
                                                                            >
                                                                                ✕
                                                                            </button>
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </td>

                                                            {/* STATUS */}
                                                            <td className="px-4 py-3">
                                                                <span
                                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
                  ${user.status?.toLowerCase() === "active"
                                                                            ? "bg-green-100 text-green-700"
                                                                            : "bg-red-100 text-red-700"
                                                                        }`}
                                                                >
                                                                    {user.status || "N/A"}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section >

            {/* CTA Section */}
            < section className="py-12 md:py-20 bg-gradient-to-br from-gray-800 to-gray-900 text-white" >
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        {/* Contact Info */}
                        <div className="text-center md:text-left">
                            <h4 className="text-xl font-semibold mb-4 text-sky-400">Contact Us</h4>
                            <div className="space-y-3">
                                {localStorage.getItem("user-name")?.toLowerCase() === "admin" && (
                                    <div className="flex items-center justify-center md:justify-start">
                                        <svg className="w-5 h-5 mr-3 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>

                                    </div>
                                )}
                                <div className="flex items-center justify-center md:justify-start">
                                    <svg className="w-5 h-5 mr-3 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-300">enquiry.women@sbhhospital.com</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start">
                                    <svg className="w-5 h-5 mr-3 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-300">enquiry.eye@sbhhospital.com</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start">
                                    <svg className="w-5 h-5 mr-3 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-gray-300">Main Rd, opposite vijeta complex, New Rajendra Nagar, Raipur, Tikrapara, Chhattisgarh 492001, India</span>
                                </div>
                            </div>

                        </div>
                        {/* Google Map Embed */}
                        <div className="">
                            <h5 className="text-lg font-medium mb-4 text-sky-400">Our Location</h5>
                            <div className="w-full h-48 md:h-64 lg:h-48">
                                <iframe
                                    src="https://www.google.com/maps?q=21.2252643564464, 81.65917230194445&hl=en&z=16&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Google Map Location"
                                ></iframe>
                            </div>
                        </div>

                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-700 my-8"></div>

                    {/* Copyright */}
                    <div className="text-center">
                        <p className="text-gray-400">
                            &copy; {new Date().getFullYear()} Sagar Pipe. All rights reserved.
                        </p>
                        <p>
                            Powered By{" "}
                            <a href="https://botivate.in/" className="text-sky-500 hover:underline">
                                Botivate
                            </a>
                        </p>

                    </div>
                </div>

            </section >
        </div >
    )
}
export default HomePage;