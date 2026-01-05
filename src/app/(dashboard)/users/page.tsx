import UsersTable from "./_components/UsersTable"

export default function UsersPage() {
  return (
    <section className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground">
          Manage registered users and view activity status.
        </p>
      </header>

      <UsersTable />
    </section>
  )
}
