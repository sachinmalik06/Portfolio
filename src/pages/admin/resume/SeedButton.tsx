import { Button } from "@/components/ui/button";
import {
    useCreateResumeExperience,
    useCreateResumeProject,
    useCreateResumeEducation,
    useCreateResumeSkill,
    useCreateResumeCertification,
    useCreateResumeLanguage,
    useCreateResumeStat
} from "@/hooks/use-cms";
import { toast } from "sonner";
import { Database } from "lucide-react";

export default function SeedButton() {
    const { mutate: createExp } = useCreateResumeExperience();
    const { mutate: createProj } = useCreateResumeProject();
    const { mutate: createEdu } = useCreateResumeEducation();
    const { mutate: createSkill } = useCreateResumeSkill();
    const { mutate: createCert } = useCreateResumeCertification();
    const { mutate: createLang } = useCreateResumeLanguage();
    const { mutate: createStat } = useCreateResumeStat();

    const handleSeed = async () => {
        if (!confirm("This will add sample data to your database. Continue?")) return;

        const toastId = toast.loading("Seeding database...");

        try {
            // 1. Experiences
            const experiences = [
                {
                    company: "Dainik Bhaskar",
                    position: "Senior Management Associate",
                    location: "Panipat, India",
                    description: "Led cross-functional teams and drove strategic initiatives to enhance operational efficiency and market penetration.",
                    start_date: "2022-01-01",
                    end_date: "2023-09-01",
                    is_current: false,
                    achievements: [
                        "Increased operational efficiency by 25% through process optimization",
                        "Managed a team of 10+ professionals across multiple departments",
                        "Developed data-driven strategies that improved market reach by 30%",
                        "Implemented business intelligence tools reducing reporting time by 40%"
                    ],
                    technologies: ["Power BI", "Excel", "Data Analysis", "Strategic Planning"]
                },
                {
                    company: "Freelance Consulting",
                    position: "Business Analyst & Consultant",
                    location: "Remote",
                    description: "Provided strategic business consulting and data analysis services to SMEs and startups.",
                    start_date: "2021-06-01",
                    end_date: "2021-12-31",
                    is_current: false,
                    achievements: [
                        "Consulted for 8+ clients across various industries",
                        "Delivered actionable insights that increased revenue by average 20%",
                        "Created comprehensive business plans and financial models",
                        "Conducted market research and competitive analysis"
                    ],
                    technologies: ["Market Research", "Financial Modeling", "Business Strategy"]
                }
            ];

            // 2. Projects
            const projects = [
                {
                    title: "Business Intelligence Dashboard",
                    description: "Developed comprehensive BI dashboard for real-time business metrics tracking and visualization",
                    technologies: ["Power BI", "Excel", "Data Analytics"],
                    impact: "Reduced decision-making time by 50%",
                    icon_name: "BarChart3"
                },
                {
                    title: "Market Expansion Strategy",
                    description: "Created data-driven market expansion plan for entering new geographical markets",
                    technologies: ["Market Research", "Strategic Planning", "Data Analysis"],
                    impact: "Identified 3 high-potential markets with 40% growth opportunity",
                    icon_name: "Target"
                },
                {
                    title: "Operational Efficiency Program",
                    description: "Designed and implemented process optimization framework across departments",
                    technologies: ["Process Mapping", "Lean Management", "KPI Tracking"],
                    impact: "Achieved 25% cost reduction and 30% time savings",
                    icon_name: "Zap"
                },
                {
                    title: "Financial Planning System",
                    description: "Built comprehensive financial planning and budgeting system for SME clients",
                    technologies: ["Financial Modeling", "Excel", "Forecasting"],
                    impact: "Improved budget accuracy by 35%",
                    icon_name: "TrendingUp"
                }
            ];

            // 3. Education
            const education = [
                {
                    degree: "MSc International Business Management",
                    institution: "GISMA University of Applied Sciences",
                    location: "Potsdam Campus, Berlin",
                    start_year: "2024",
                    end_year: "",
                    gpa: "",
                    highlights: ["Current", "Global Business", "Strategic Management", "International Markets"],
                    coursework: ["Global Strategy", "International Marketing", "Cross-Cultural Management", "Business Analytics"]
                },
                {
                    degree: "Master of Commerce (M.Com)",
                    institution: "Kurukshetra University",
                    location: "India",
                    start_year: "2021",
                    end_year: "2023",
                    gpa: "First Division",
                    highlights: ["Commerce", "Business Studies", "Finance"],
                    coursework: ["Advanced Accounting", "Financial Management", "Business Economics"]
                },
                {
                    degree: "Bachelor of Commerce (B.Com)",
                    institution: "Kurukshetra University",
                    location: "India",
                    start_year: "2016",
                    end_year: "2019",
                    gpa: "First Division",
                    highlights: ["Commerce", "Accounting", "Economics"],
                    coursework: ["Financial Accounting", "Business Law", "Economics", "Statistics"]
                }
            ];

            // 4. Skills
            const skills = [
                { name: "Microsoft 365", category: "Technical Skills", proficiency: 90 },
                { name: "Power BI", category: "Technical Skills", proficiency: 85 },
                { name: "Data Analysis", category: "Technical Skills", proficiency: 88 },
                { name: "Excel (Advanced)", category: "Technical Skills", proficiency: 92 },
                { name: "Business Intelligence", category: "Technical Skills", proficiency: 85 },
                { name: "SQL", category: "Technical Skills", proficiency: 75 },
                { name: "Tableau", category: "Technical Skills", proficiency: 70 },
                { name: "Strategic Planning", category: "Business Skills", proficiency: 90 },
                { name: "Financial Planning", category: "Business Skills", proficiency: 85 },
                { name: "Team Leadership", category: "Business Skills", proficiency: 88 },
                { name: "Project Management", category: "Business Skills", proficiency: 87 },
                { name: "Cross-functional Collaboration", category: "Business Skills", proficiency: 90 },
                { name: "Operational Optimization", category: "Business Skills", proficiency: 87 },
                { name: "Market Research", category: "Business Skills", proficiency: 83 },
                { name: "Communication", category: "Soft Skills", proficiency: 92 },
                { name: "Problem Solving", category: "Soft Skills", proficiency: 90 },
                { name: "Critical Thinking", category: "Soft Skills", proficiency: 88 },
                { name: "Adaptability", category: "Soft Skills", proficiency: 90 }
            ];

            // 5. Certifications
            const certifications = [
                {
                    name: "Business Analytics Certificate",
                    issuer: "Google",
                    year: "2023",
                    description: "Data analysis, visualization, and business intelligence"
                },
                {
                    name: "Project Management Professional (PMP)",
                    issuer: "PMI",
                    year: "2022",
                    description: "Project planning, execution, and stakeholder management"
                },
                {
                    name: "Digital Marketing Certification",
                    issuer: "HubSpot",
                    year: "2023",
                    description: "SEO, content marketing, and digital strategy"
                },
                {
                    name: "Financial Modeling & Valuation",
                    issuer: "Corporate Finance Institute",
                    year: "2022",
                    description: "Advanced financial modeling and business valuation"
                },
                {
                    name: "Data Analytics Professional",
                    issuer: "IBM",
                    year: "2023",
                    description: "Data analysis, Python, and statistical methods"
                },
                {
                    name: "Lean Six Sigma Green Belt",
                    issuer: "ASQ",
                    year: "2022",
                    description: "Process improvement and quality management"
                }
            ];

            // 6. Languages
            const languages = [
                { name: "Hindi", level: "Native", proficiency: 100 },
                { name: "English", level: "Proficient (C1)", proficiency: 90 },
                { name: "German", level: "Basic (A1)", proficiency: 30 }
            ];

            // 7. Stats
            const stats = [
                { label: "Years Experience", value: 2, suffix: "+", icon_name: "Briefcase", color: "text-blue-500" },
                { label: "Projects Completed", value: 15, suffix: "+", icon_name: "Rocket", color: "text-green-500" },
                { label: "Certifications", value: 6, suffix: "", icon_name: "Award", color: "text-purple-500" },
                { label: "Success Rate", value: 95, suffix: "%", icon_name: "TrendingUp", color: "text-primary" }
            ];

            await Promise.all([
                ...experiences.map((item, i) => createExp({ ...item, order: i + 1, active: true })),
                ...projects.map((item, i) => createProj({ ...item, order: i + 1, active: true })),
                ...education.map((item, i) => createEdu({ ...item, order: i + 1, active: true })),
                ...skills.map((item, i) => createSkill({ ...item, order: i + 1, active: true })),
                ...certifications.map((item, i) => createCert({ ...item, order: i + 1, active: true })),
                ...languages.map((item, i) => createLang({ ...item, order: i + 1, active: true })),
                ...stats.map((item, i) => createStat({ ...item, order: i + 1, active: true })),
            ]);

            toast.success("Database seeded successfully!", { id: toastId });
        } catch (error: any) {
            console.error(error);
            toast.error(`Failed to seed: ${error.message || "Unknown error"}`, { id: toastId });
        }
    };

    return (
        <Button onClick={handleSeed} variant="outline" size="sm">
            <Database className="w-4 h-4 mr-2" />
            Seed Data
        </Button>
    );
}
