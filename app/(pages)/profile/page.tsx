"use client";

import Button from "@/app/Components/common/Button";
import type { UserProfile } from "@/app/types/common";
import { Camera, IndianRupee, Lock, UserRound } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const PLANNING_STYLES = [
  "Weekly guided",
  "Monthly guided",
  "Weekly and monthly guided",
  "Flexible planning",
];

function formatSalary(value: number | null) {
  if (value === null) {
    return "Not set";
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function formatUnlockDate(value: string | null) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Page() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [region, setRegion] = useState("");
  const [planningStyle, setPlanningStyle] = useState("");
  const [monthlySalary, setMonthlySalary] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok || !data.user) {
          throw new Error(data.message || "Failed to load profile");
        }

        setProfile(data.user);
        setRegion(data.user.region ?? "");
        setPlanningStyle(data.user.planningStyle ?? "");
        setMonthlySalary(
          data.user.monthlySalary !== null
            ? String(data.user.monthlySalary)
            : "",
        );
      } catch (error) {
        console.error("Failed to load profile", error);
        toast.error("Unable to load profile");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSave() {
    setIsSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          region,
          planningStyle,
          monthlySalary:
            monthlySalary.trim() === "" ? null : Number(monthlySalary),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Unable to save profile");
        if (data.user) {
          setProfile(data.user);
        }
        return;
      }

      setProfile(data.user);
      setRegion(data.user.region ?? "");
      setPlanningStyle(data.user.planningStyle ?? "");
      setMonthlySalary(
        data.user.monthlySalary !== null ? String(data.user.monthlySalary) : "",
      );
      toast.success("Profile saved successfully");
    } catch (error) {
      console.error("Failed to save profile", error);
      toast.error("Unable to save profile");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleImageUpload(file: File) {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Unable to upload image");
        return;
      }

      setProfile(data.user);
      toast.success("Profile photo updated");
    } catch (error) {
      console.error("Failed to upload image", error);
      toast.error("Unable to upload image");
    } finally {
      setIsUploading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="page-shell py-6 sm:py-10">
        <p className="theme-text-muted">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="page-shell py-6 sm:py-10">
      <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="glass-card-strong rounded-[2rem] p-6 sm:p-8">
          <span className="section-kicker">Profile</span>

          <div className="mt-5 flex items-center gap-4">
            <div className="relative">
              <div className="theme-button-primary flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.7rem]">
                {profile?.profileImage ? (
                  <Image
                    src={profile.profileImage}
                    alt={profile.userName}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <UserRound size={30} />
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="theme-button-secondary absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full"
                aria-label="Upload profile photo"
              >
                <Camera size={16} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void handleImageUpload(file);
                  }
                  event.target.value = "";
                }}
              />
            </div>

            <div>
              <h1 className="theme-text text-3xl font-semibold tracking-[-0.05em]">
                {profile?.userName || "User"}
              </h1>
              <p className="theme-text-soft mt-1 text-sm">
                {profile?.email || "No email found"}
              </p>
            </div>
          </div>

          <p className="theme-text-muted mt-6 text-base leading-8">
            Save your profile details here. Monthly salary can only be changed
            once every 2 months after it is set.
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="profile-region"
                className="theme-text-soft mb-2 block text-sm font-semibold"
              >
                Region
              </label>
              <input
                id="profile-region"
                type="text"
                placeholder="e.g. New Delhi, India"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="profile-planning-style"
                className="theme-text-soft mb-2 block text-sm font-semibold"
              >
                Planning style
              </label>
              <select
                id="profile-planning-style"
                value={planningStyle}
                onChange={(event) => setPlanningStyle(event.target.value)}
              >
                <option value="">Select planning style</option>
                {PLANNING_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="profile-salary"
                className="theme-text-soft mb-2 block text-sm font-semibold"
              >
                Monthly salary in hand
              </label>
              <input
                id="profile-salary"
                type="number"
                min="0"
                placeholder="Enter monthly salary"
                value={monthlySalary}
                disabled={!profile?.canEditSalary}
                onChange={(event) => setMonthlySalary(event.target.value)}
              />
              {!profile?.canEditSalary && profile?.salaryUnlockDate && (
                <p className="theme-text-muted mt-2 text-sm">
                  Salary locked until {formatUnlockDate(profile.salaryUnlockDate)}
                </p>
              )}
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving || isUploading}
              className="w-full rounded-[1.15rem]"
            >
              {isSaving ? "Saving..." : "Save profile"}
            </Button>
          </div>
        </aside>

        <div className="glass-grid">
          <article className="glass-card rounded-[1.8rem] p-6">
            <div className="flex items-center gap-4">
              <div className="icon-chip theme-text">
                <IndianRupee size={18} />
              </div>
              <div>
                <p className="theme-text-soft text-sm">Monthly salary</p>
                <h2 className="theme-text text-2xl font-semibold tracking-[-0.05em]">
                  {formatSalary(profile?.monthlySalary ?? null)}
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="theme-surface rounded-[1.25rem] px-4 py-4">
                <p className="theme-text-soft text-sm">Current region</p>
                <p className="theme-text mt-2 font-semibold">
                  {region || "Not set"}
                </p>
              </div>
              <div className="theme-surface rounded-[1.25rem] px-4 py-4">
                <p className="theme-text-soft text-sm">Planning style</p>
                <p className="theme-text mt-2 font-semibold">
                  {planningStyle || "Not set"}
                </p>
              </div>
            </div>
          </article>

          <article className="glass-card rounded-[1.8rem] p-6">
            <div className="flex items-center gap-4">
              <div className="icon-chip theme-text">
                <Lock size={18} />
              </div>
              <div>
                <p className="theme-text-soft text-sm">Salary edit policy</p>
                <h2 className="theme-text text-2xl font-semibold tracking-[-0.05em]">
                  {profile?.canEditSalary ? "Editable now" : "Locked for now"}
                </h2>
              </div>
            </div>

            <p className="theme-text-muted mt-5 text-sm leading-7">
              {profile?.canEditSalary
                ? "You can set or update your monthly in-hand salary now. After saving, it will stay locked for the next 2 months."
                : `Your salary was last updated on ${formatUnlockDate(profile?.salaryUpdatedAt ?? null)}. You can change it again after ${formatUnlockDate(profile?.salaryUnlockDate ?? null)}.`}
            </p>
          </article>

          <article className="theme-inverse-card rounded-[1.8rem] p-6">
            <p className="theme-inverse-muted text-sm">Profile photo</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em]">
              {isUploading ? "Uploading photo..." : "Upload a clear photo"}
            </h2>
            <p className="theme-inverse-muted mt-3 text-sm leading-7">
              JPG, PNG, WEBP, or GIF up to 2MB. Your photo is saved to your
              account and shown across the app.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
