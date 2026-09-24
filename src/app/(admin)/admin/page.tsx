"use client";

import { Shield, KeyRound, Database, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabList, TabTrigger, TabContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/feedback-states";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-6">
      {/* Admin Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] font-mono">
              SYSTEM ADMINISTRATION & AUDIT
            </span>
            <Badge variant="outline" size="sm">
              Phase 1 Structural Shell
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Governance, Clinical Audit & Configuration
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            DPDP Act 2023 consent retention, physician audit logs, and ABDM interoperability bridge settings.
          </p>
        </div>
      </header>

      {/* Admin Tabs */}
      <Tabs defaultValue="audit">
        <TabList>
          <TabTrigger value="audit">Clinical Audit Trail</TabTrigger>
          <TabTrigger value="privacy">DPDP Audio Retention</TabTrigger>
          <TabTrigger value="abdm">ABDM & FHIR Config</TabTrigger>
          <TabTrigger value="users">Roles & Permissions</TabTrigger>
        </TabList>

        <TabContent value="audit" className="mt-4">
          <Card elevated>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Physician Edit & Verification Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="Clinical Audit Log Shell"
                whatShouldAppearHere="Immutable log of all clinician edits, fact verifications, and rejections with timestamps and user identifiers."
                icon={<FileText className="w-6 h-6 text-[var(--primary)]" />}
              />
            </CardContent>
          </Card>
        </TabContent>

        <TabContent value="privacy" className="mt-4">
          <Card elevated>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">DPDP Act 2023 Audio Retention Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="Audio Lifecycle & Auto-Purge Policy"
                whatShouldAppearHere="Automated retention schedule purging ephemeral patient audio recordings within 24 hours of doctor-verified encounter."
                icon={<Shield className="w-6 h-6 text-[var(--primary)]" />}
              />
            </CardContent>
          </Card>
        </TabContent>

        <TabContent value="abdm" className="mt-4">
          <Card elevated>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">ABDM Ecosystem Sandbox Bridge</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="FHIR R4 & ABDM Gateway Adapter"
                whatShouldAppearHere="Configuration for local FHIR R4 document compilation and future authenticated ABDM M1/M2/M3 gateway credentials."
                icon={<Database className="w-6 h-6 text-[var(--primary)]" />}
              />
            </CardContent>
          </Card>
        </TabContent>

        <TabContent value="users" className="mt-4">
          <Card elevated>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Hospital Staff Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="Role-Based Access Control (RBAC)"
                whatShouldAppearHere="Management of OPD Triage Nurses, Attending Clinicians, Resident Medical Officers, and Kiosk Operators."
                icon={<KeyRound className="w-6 h-6 text-[var(--primary)]" />}
              />
            </CardContent>
          </Card>
        </TabContent>
      </Tabs>
    </div>
  );
}
