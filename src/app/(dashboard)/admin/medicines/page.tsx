"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/axios";
import { SkeletonTable } from "@/components/skeletons/SkeletonTable";
import { medicineSchema, type MedicineInput } from "@/validations/schemas";
import type { Medicine } from "@/types";

interface MedicinesResponse {
  success: boolean;
  data: Medicine[];
  pagination: { total: number };
}

/** API payload with numeric price/stock (form schema uses strings for input) */
type MedicineApiPayload = Omit<MedicineInput, "price" | "stock"> & {
  price: number;
  stock: number;
};

export default function AdminMedicinesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Medicine | null>(null);

  const { data, isLoading } = useQuery<MedicinesResponse>({
    queryKey: ["admin-medicines"],
    queryFn: () =>
      apiClient
        .get("/medicines", { params: { limit: 100 } })
        .then((r) => r.data),
    staleTime: 30_000,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MedicineInput>({
    resolver: zodResolver(medicineSchema),
  });

  const createMutation = useMutation({
    mutationFn: (d: MedicineApiPayload) =>
      apiClient.post("/admin/medicines", d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-medicines"] });
      setShowForm(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MedicineApiPayload }) =>
      apiClient.put(`/admin/medicines/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-medicines"] });
      setEditing(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/medicines/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-medicines"] }),
  });

  const onSubmit = (d: MedicineInput) => {
    const payload: MedicineApiPayload = {
      ...d,
      price: Number(d.price),
      stock: Number(d.stock),
    };
    if (editing) updateMutation.mutate({ id: editing._id, data: payload });
    else createMutation.mutate(payload);
  };

  const openEdit = (med: Medicine) => {
    setEditing(med);
    reset({
      brandName: med.brandName,
      genericName: med.genericName,
      price: String(med.price),
      stock: String(med.stock),
      category: med.category,
      description: med.description,
      uses: med.uses,
      sideEffects: med.sideEffects,
      precautions: med.precautions,
    });
    setShowForm(true);
  };

  const medicines = data?.data ?? [];
  const fields: (keyof MedicineInput)[] = [
    "brandName",
    "genericName",
    "category",
    "price",
    "stock",
    "description",
    "uses",
    "sideEffects",
    "precautions",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Medicine Database</h1>
          <p className="text-sm text-slate-400 mt-1">
            {medicines.length} medicines in catalogue.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            reset();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition"
        >
          <Plus className="w-4 h-4" /> Add Medicine
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm">
              {editing ? "Edit Medicine" : "New Medicine"}
            </h2>
            <button onClick={() => setShowForm(false)}>
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid sm:grid-cols-2 gap-3"
          >
            {fields.map((f) => (
              <div
                key={f}
                className={
                  f === "description" ||
                  f === "uses" ||
                  f === "sideEffects" ||
                  f === "precautions"
                    ? "sm:col-span-2"
                    : ""
                }
              >
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1 capitalize">
                  {f.replace(/([A-Z])/g, " $1")}
                </label>
                {f === "description" ||
                f === "uses" ||
                f === "sideEffects" ||
                f === "precautions" ? (
                  <textarea
                    {...register(f)}
                    rows={2}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition resize-none"
                  />
                ) : (
                  <input
                    {...register(f)}
                    type={f === "price" || f === "stock" ? "number" : "text"}
                    step={f === "price" ? "0.01" : undefined}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition"
                  />
                )}
                {errors[f] && (
                  <p className="text-[10px] text-red-500 mt-0.5">
                    {errors[f]?.message}
                  </p>
                )}
              </div>
            ))}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  createMutation.isPending ||
                  updateMutation.isPending
                }
                className="px-5 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition disabled:opacity-60 flex items-center gap-2"
              >
                {(isSubmitting ||
                  createMutation.isPending ||
                  updateMutation.isPending) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <SkeletonTable rows={6} />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <tr>
                {[
                  "Brand",
                  "Generic",
                  "Category",
                  "Price",
                  "Stock",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-black uppercase text-slate-400 tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {medicines.map((med) => (
                <tr
                  key={med._id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-950 transition"
                >
                  <td className="px-4 py-3 font-bold text-sm">
                    {med.brandName}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {med.genericName}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                      {med.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    ${med.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-xs">{med.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(med)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(med._id)}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
