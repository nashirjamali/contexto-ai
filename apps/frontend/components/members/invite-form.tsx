"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addMember } from "@/lib/api/workspaces";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { MembershipRole } from "@/lib/types";

const schema = z.object({
  email: z.string().email(),
  role: z.enum(["owner", "admin", "member", "viewer"]),
});

type FormData = z.infer<typeof schema>;

interface InviteFormProps {
  workspaceId: string;
  onSuccess?: () => void;
}

export function InviteForm({ workspaceId, onSuccess }: InviteFormProps) {
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "member" },
  });

  const invite = useMutation({
    mutationFn: (data: FormData) =>
      addMember(workspaceId, {
        email: data.email,
        role: data.role as MembershipRole,
      }),
    onSuccess: () => {
      setSuccess("Member invited successfully");
      reset();
      onSuccess?.();
    },
    onError: (e: Error) => {
      setError("root", { message: e.message });
    },
  });

  return (
    <form
      onSubmit={handleSubmit((d) => invite.mutate(d))}
      className="space-y-4 rounded-sm border border-surface-raised bg-surface p-6"
    >
      <h3 className="font-display text-lg text-paper">Invite member</h3>
      <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <Select label="Role" {...register("role")}>
        <option value="admin">Admin</option>
        <option value="member">Member</option>
        <option value="viewer">Viewer</option>
      </Select>
      {errors.root && <p className="text-sm text-ember">{errors.root.message}</p>}
      {success && <p className="text-sm text-sage">{success}</p>}
      <Button type="submit" disabled={invite.isPending}>
        {invite.isPending ? "Inviting…" : "Send invite"}
      </Button>
    </form>
  );
}
