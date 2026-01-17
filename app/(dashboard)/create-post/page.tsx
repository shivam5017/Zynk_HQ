

import { authSession } from "@/lib/server/auth-utils";
import { getTwitterAccounts } from "@/app/actions/user";
import CreatePostClient from "@/components/pages/create-post";

export default async function CreatePostPage() {
  const session = await authSession();
  if (!session) return null;

  const accounts = await getTwitterAccounts(); 

  return <CreatePostClient accounts={accounts} />;
}
