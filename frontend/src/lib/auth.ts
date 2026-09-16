import { useSyncExternalStore } from "react";
import { client } from "@/apollo/client";
import { LOGIN } from "@/graphql/operations";
import { mapUser, toGraphRole } from "@/lib/graphql-mappers";
import type { Role, User } from "@/types";
const AUTH_KEY = "smilecare_user";
const listeners = new Set<() => void>();
function loadUser(): User | null {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}
let user = loadUser();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function getUser() {
  return user;
}
export function hasRole(...roles: Role[]) {
  return !!user && roles.includes(user.role);
}
export async function login(email: string, password: string, role: Role = "patient") {
  try {
    const { data } = await client.mutate<{ login: { id: string; name: string; email: string; role: string; phone?: string | null; avatar?: string | null; clinicId?: string | null } | null }>({
      mutation: LOGIN,
      variables: { email, password, role: toGraphRole(role) },
    });
    if (!data?.login) return false;
    user = mapUser(data.login);
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
    emit();
    return true;
  } catch {
    return false;
  }
}
export function logout() {
  user = null;
  sessionStorage.removeItem(AUTH_KEY);
  emit();
}
export function useAuth() {
  const currentUser = useSyncExternalStore(subscribe, getUser, getUser);
  return {
    user: currentUser,
    login,
    logout,
    hasRole,
  };
}
