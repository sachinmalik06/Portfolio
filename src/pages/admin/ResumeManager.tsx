import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExperiencesTab from "./resume/ExperiencesTab";
import ProjectsTab from "./resume/ProjectsTab";
import EducationTab from "./resume/EducationTab";
import SkillsTab from "./resume/SkillsTab";
import CertificationsTab from "./resume/CertificationsTab";
import LanguagesTab from "./resume/LanguagesTab";
import StatsTab from "./resume/StatsTab";
import { Briefcase, Folder, GraduationCap, Zap, Award, Languages, BarChart3 } from "lucide-react";

export default function ResumeManager() {
    const [activeTab, setActiveTab] = useState("experiences");

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-display font-bold">Resume Management</h1>
                <p className="text-muted-foreground">Manage all sections of your resume page from one place.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-muted/50 p-1 rounded-lg flex flex-wrap h-auto gap-2 justify-start overflow-x-auto">
                    <TabsTrigger value="experiences" className="gap-2">
                        <Briefcase className="w-4 h-4" /> Experiences
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="gap-2">
                        <Folder className="w-4 h-4" /> Projects
                    </TabsTrigger>
                    <TabsTrigger value="education" className="gap-2">
                        <GraduationCap className="w-4 h-4" /> Education
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="gap-2">
                        <Zap className="w-4 h-4" /> Skills
                    </TabsTrigger>
                    <TabsTrigger value="certifications" className="gap-2">
                        <Award className="w-4 h-4" /> Certifications
                    </TabsTrigger>
                    <TabsTrigger value="languages" className="gap-2">
                        <Languages className="w-4 h-4" /> Languages
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="gap-2">
                        <BarChart3 className="w-4 h-4" /> Stats
                    </TabsTrigger>
                </TabsList>

                <div className="border bg-card rounded-lg p-6 shadow-sm">
                    <TabsContent value="experiences" className="mt-0 space-y-4">
                        <ExperiencesTab />
                    </TabsContent>

                    <TabsContent value="projects" className="mt-0 space-y-4">
                        <ProjectsTab />
                    </TabsContent>

                    <TabsContent value="education" className="mt-0 space-y-4">
                        <EducationTab />
                    </TabsContent>

                    <TabsContent value="skills" className="mt-0 space-y-4">
                        <SkillsTab />
                    </TabsContent>

                    <TabsContent value="certifications" className="mt-0 space-y-4">
                        <CertificationsTab />
                    </TabsContent>

                    <TabsContent value="languages" className="mt-0 space-y-4">
                        <LanguagesTab />
                    </TabsContent>

                    <TabsContent value="stats" className="mt-0 space-y-4">
                        <StatsTab />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
