import { useSupabaseQuery } from './use-supabase-query';
import * as cms from '@/lib/supabase-cms';
import { useState } from 'react';

// Profile Card Settings
export function useProfileCardSettings() {
  return useSupabaseQuery(
    () => cms.getProfileCardSettings(),
    []
  );
}

export function useUpdateProfileCardSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (settings: Parameters<typeof cms.updateProfileCardSettings>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateProfileCardSettings(settings);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Footer Settings
export function useFooterSettings() {
  return useSupabaseQuery(
    () => cms.getFooterSettings(),
    []
  );
}

export function useUpdateFooterSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (settings: Parameters<typeof cms.updateFooterSettings>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateFooterSettings(settings);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// About Footer Text
export function useAboutFooterText() {
  return useSupabaseQuery(
    () => cms.getAboutFooterText(),
    []
  );
}

export function useUpdateAboutFooterText() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (settings: Parameters<typeof cms.updateAboutFooterText>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateAboutFooterText(settings);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Logo Settings
export function useLogoSettings() {
  return useSupabaseQuery(
    () => cms.getLogoSettings(),
    []
  );
}

export function useUpdateLogoSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (settings: Parameters<typeof cms.updateLogoSettings>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateLogoSettings(settings);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Meta Tags Settings
export function useMetaTags() {
  return useSupabaseQuery(
    () => cms.getMetaTags(),
    []
  );
}

export function useUpdateMetaTags() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (settings: Parameters<typeof cms.updateMetaTags>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateMetaTags(settings);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Expertise Cards
export function useExpertiseCards(includeInactive = false) {
  return useSupabaseQuery(
    () => cms.getExpertiseCards(includeInactive),
    [includeInactive]
  );
}

export function useCreateExpertiseCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (card: Parameters<typeof cms.createExpertiseCard>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.createExpertiseCard(card);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useUpdateExpertiseCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, updates: Parameters<typeof cms.updateExpertiseCard>[1]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateExpertiseCard(id, updates);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useDeleteExpertiseCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cms.deleteExpertiseCard(id);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Pages
export function usePage(slug: string) {
  return useSupabaseQuery(
    () => cms.getPage(slug),
    [slug]
  );
}

export function useSiteSettings() {
  return useSupabaseQuery(() => cms.getSiteSettings(), []);
}

export function useUpdatePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (slug: string, content: any, title?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updatePage(slug, content, title);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Timeline
export function useTimeline() {
  return useSupabaseQuery(() => cms.getTimeline(), []);
}

export function useCreateTimelineEntry() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (entry: Parameters<typeof cms.createTimelineEntry>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.createTimelineEntry(entry);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useUpdateTimelineEntry() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, updates: Parameters<typeof cms.updateTimelineEntry>[1]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateTimelineEntry(id, updates);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useDeleteTimelineEntry() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cms.deleteTimelineEntry(id);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Gallery Items
export function useGalleryItems(includeInactive = false) {
  return useSupabaseQuery(
    () => cms.getGalleryItems(includeInactive),
    [includeInactive]
  );
}

export function useCreateGalleryItem() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (item: Parameters<typeof cms.createGalleryItem>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.createGalleryItem(item);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useUpdateGalleryItem() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, updates: Parameters<typeof cms.updateGalleryItem>[1]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateGalleryItem(id, updates);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useDeleteGalleryItem() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cms.deleteGalleryItem(id);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Gallery Text Settings
export function useGalleryTextSettings() {
  return useSupabaseQuery(
    () => cms.getGalleryTextSettings(),
    []
  );
}

export function useUpdateGalleryTextSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (settings: Parameters<typeof cms.updateGalleryTextSettings>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateGalleryTextSettings(settings);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Home Projects Settings
export function useHomeProjectsSettings() {
  return useSupabaseQuery(
    () => cms.getHomeProjectsSettings(),
    []
  );
}

export function useUpdateHomeProjectsSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (settings: Parameters<typeof cms.updateHomeProjectsSettings>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateHomeProjectsSettings(settings);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Certifications
export function useCertifications() {
  return useSupabaseQuery(
    () => cms.getCertifications(),
    []
  );
}

export function useCreateCertification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (certification: Parameters<typeof cms.createCertification>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.createCertification(certification);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useUpdateCertification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, certification: Parameters<typeof cms.updateCertification>[1]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateCertification(id, certification);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useDeleteCertification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cms.deleteCertification(id);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// --- RESUME HOOKS ---

// Experiences
export function useResumeExperiences(includeInactive = false) {
  return useSupabaseQuery(
    () => cms.getResumeExperiences(includeInactive),
    [includeInactive]
  );
}

export function useCreateResumeExperience() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (experience: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.createResumeExperience(experience);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useUpdateResumeExperience() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, updates: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateResumeExperience(id, updates);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useDeleteResumeExperience() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cms.deleteResumeExperience(id);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Projects
export function useResumeProjects(includeInactive = false) {
  return useSupabaseQuery(
    () => cms.getResumeProjects(includeInactive),
    [includeInactive]
  );
}

export function useCreateResumeProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (project: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.createResumeProject(project);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useUpdateResumeProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, updates: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateResumeProject(id, updates);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useDeleteResumeProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cms.deleteResumeProject(id);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Education
export function useResumeEducation(includeInactive = false) {
  return useSupabaseQuery(
    () => cms.getResumeEducation(includeInactive),
    [includeInactive]
  );
}

export function useCreateResumeEducation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (education: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.createResumeEducation(education);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useUpdateResumeEducation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, updates: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateResumeEducation(id, updates);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useDeleteResumeEducation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cms.deleteResumeEducation(id);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Skills
export function useResumeSkills(includeInactive = false) {
  return useSupabaseQuery(
    () => cms.getResumeSkills(includeInactive),
    [includeInactive]
  );
}

export function useCreateResumeSkill() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (skill: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.createResumeSkill(skill);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useUpdateResumeSkill() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, updates: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateResumeSkill(id, updates);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useDeleteResumeSkill() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cms.deleteResumeSkill(id);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Certifications
export function useResumeCertifications(includeInactive = false) {
  return useSupabaseQuery(
    () => cms.getResumeCertifications(includeInactive),
    [includeInactive]
  );
}

export function useCreateResumeCertification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (certification: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.createResumeCertification(certification);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useUpdateResumeCertification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, updates: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateResumeCertification(id, updates);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useDeleteResumeCertification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cms.deleteResumeCertification(id);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Languages
export function useResumeLanguages(includeInactive = false) {
  return useSupabaseQuery(
    () => cms.getResumeLanguages(includeInactive),
    [includeInactive]
  );
}

export function useCreateResumeLanguage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (language: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.createResumeLanguage(language);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useUpdateResumeLanguage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, updates: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateResumeLanguage(id, updates);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useDeleteResumeLanguage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cms.deleteResumeLanguage(id);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Stats
export function useResumeStats(includeInactive = false) {
  return useSupabaseQuery(
    () => cms.getResumeStats(includeInactive),
    [includeInactive]
  );
}

export function useCreateResumeStat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (stat: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.createResumeStat(stat);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useUpdateResumeStat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, updates: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateResumeStat(id, updates);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useDeleteResumeStat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cms.deleteResumeStat(id);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Resume Hero
export function useResumeHero() {
  return useSupabaseQuery(
    () => cms.getResumeHero(),
    []
  );
}

export function useUpdateResumeHero() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, updates: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateResumeHero(id, updates);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}
