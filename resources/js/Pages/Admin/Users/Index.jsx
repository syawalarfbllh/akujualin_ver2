import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import {
    Table,
    Badge,
    Button,
    Title,
    Stack,
    Paper,
    Group,
    ActionIcon,
    Box,
    TextInput,
    Text,
} from "@mantine/core";
import {
    IconSearch,
    IconTrash,
    IconPower,
    IconCheck,
} from "@tabler/icons-react";

export default function UserIndex({ auth, users = [] }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Kelola User" />
            <Stack gap="lg">
                <Box>
                    <Title order={2}>Kelola Pengguna</Title>
                    <Text c="dimmed">
                        Aktifkan UMKM atau manajemen akun mahasiswa.
                    </Text>
                </Box>

                <Paper withBorder p="md" radius="md">
                    <Table highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Nama</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Role</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th ta="right">Aksi</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {users.map((u) => (
                                <Table.Tr key={u.id}>
                                    <Table.Td fw={500}>{u.name}</Table.Td>
                                    <Table.Td>{u.email}</Table.Td>
                                    <Table.Td>
                                        <Badge
                                            variant="dot"
                                            color={
                                                u.role === "staff_umkm"
                                                    ? "blue"
                                                    : "orange"
                                            }
                                        >
                                            {u.role}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge
                                            color={
                                                u.is_active ? "green" : "red"
                                            }
                                        >
                                            {u.is_active ? "Aktif" : "Blokir"}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group justify="flex-end" gap="xs">
                                            <Button
                                                size="compact-xs"
                                                color={
                                                    u.is_active
                                                        ? "red"
                                                        : "green"
                                                }
                                                onClick={() =>
                                                    router.patch(
                                                        route(
                                                            "admin.users.toggle",
                                                            u.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                {u.is_active
                                                    ? "Blokir"
                                                    : "Aktifkan"}
                                            </Button>
                                            <ActionIcon
                                                color="red"
                                                variant="subtle"
                                                onClick={() => {
                                                    if (confirm("Hapus?"))
                                                        router.delete(
                                                            route(
                                                                "admin.users.destroy",
                                                                u.id,
                                                            ),
                                                        );
                                                }}
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Paper>
            </Stack>
        </AuthenticatedLayout>
    );
}
