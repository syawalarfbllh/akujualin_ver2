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
    ScrollArea,
    Avatar,
    Drawer,
    Grid,
    Divider,
    ThemeIcon,
    SimpleGrid,
    Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconSearch,
    IconTrash,
    IconCheck,
    IconX,
    IconEye,
    IconBrandInstagram,
    IconBrandTiktok,
    IconBrandWhatsapp,
    IconBuildingBank,
    IconPhone,
    IconId,
    IconUser,
} from "@tabler/icons-react";
import { useState } from "react";

export default function UserIndex({ auth, users = [] }) {
    // State untuk Search
    const [search, setSearch] = useState("");

    // State untuk Drawer Detail
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Filter User berdasarkan Search (Frontend side sementara)
    // Idealnya filter ini dilakukan di Backend seperti contoh Komisi sebelumnya
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()),
    );

    // Handler Buka Detail
    const handleViewDetail = (user) => {
        setSelectedUser(user);
        open();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Kelola User" />

            <Stack gap="lg">
                {/* HEADER */}
                <Group justify="space-between" align="flex-end">
                    <Box>
                        <Title order={2}>Kelola Pengguna</Title>
                        <Text c="dimmed">
                            Manajemen akun mahasiswa (Affiliator) dan UMKM.
                        </Text>
                    </Box>
                    <TextInput
                        placeholder="Cari nama atau email..."
                        leftSection={<IconSearch size={16} />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        w={300}
                    />
                </Group>

                {/* TABLE CARD */}
                <Paper
                    withBorder
                    p={0}
                    radius="md"
                    shadow="sm"
                    style={{ overflow: "hidden" }}
                >
                    <ScrollArea>
                        <Table highlightOnHover miw={800} verticalSpacing="md">
                            <Table.Thead bg="gray.0">
                                <Table.Tr>
                                    <Table.Th>User Info</Table.Th>
                                    <Table.Th>Role & Kontak</Table.Th>
                                    <Table.Th>Status Akun</Table.Th>
                                    <Table.Th ta="center">Aksi</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {filteredUsers.map((u) => (
                                    <Table.Tr key={u.id}>
                                        <Table.Td>
                                            <Group gap="sm">
                                                <Avatar
                                                    src={u.avatar}
                                                    radius="xl"
                                                    size="md"
                                                    color="blue"
                                                >
                                                    {u.name?.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Text size="sm" fw={500}>
                                                        {u.name}
                                                    </Text>
                                                    <Text size="xs" c="dimmed">
                                                        {u.email}
                                                    </Text>
                                                </Box>
                                            </Group>
                                        </Table.Td>

                                        <Table.Td>
                                            <Stack gap={4}>
                                                <Badge
                                                    size="sm"
                                                    variant="light"
                                                    color={
                                                        u.role === "staff_umkm"
                                                            ? "blue"
                                                            : "orange"
                                                    }
                                                >
                                                    {u.role === "staff_umkm"
                                                        ? "UMKM"
                                                        : "Mahasiswa"}
                                                </Badge>
                                                <Group gap={4}>
                                                    <IconPhone
                                                        size={12}
                                                        color="gray"
                                                    />
                                                    <Text size="xs" c="dimmed">
                                                        {u.phone_number || "-"}
                                                    </Text>
                                                </Group>
                                            </Stack>
                                        </Table.Td>

                                        <Table.Td>
                                            <Badge
                                                variant={
                                                    u.is_active
                                                        ? "filled"
                                                        : "outline"
                                                }
                                                color={
                                                    u.is_active
                                                        ? "green"
                                                        : "red"
                                                }
                                            >
                                                {u.is_active
                                                    ? "Aktif"
                                                    : "Diblokir"}
                                            </Badge>
                                        </Table.Td>

                                        <Table.Td>
                                            <Group justify="center" gap="xs">
                                                <Tooltip label="Lihat Detail Lengkap">
                                                    <ActionIcon
                                                        variant="light"
                                                        color="blue"
                                                        onClick={() =>
                                                            handleViewDetail(u)
                                                        }
                                                    >
                                                        <IconEye size={18} />
                                                    </ActionIcon>
                                                </Tooltip>

                                                <Tooltip
                                                    label={
                                                        u.is_active
                                                            ? "Blokir Akun"
                                                            : "Aktifkan Akun"
                                                    }
                                                >
                                                    <ActionIcon
                                                        color={
                                                            u.is_active
                                                                ? "red"
                                                                : "green"
                                                        }
                                                        variant="subtle"
                                                        onClick={() => {
                                                            router.patch(
                                                                route(
                                                                    "admin.users.toggle",
                                                                    u.id,
                                                                ),
                                                            );
                                                        }}
                                                    >
                                                        {u.is_active ? (
                                                            <IconX size={18} />
                                                        ) : (
                                                            <IconCheck
                                                                size={18}
                                                            />
                                                        )}
                                                    </ActionIcon>
                                                </Tooltip>

                                                <Tooltip label="Hapus Permanen">
                                                    <ActionIcon
                                                        color="red"
                                                        variant="subtle"
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    "Yakin hapus user ini beserta datanya?",
                                                                )
                                                            )
                                                                router.delete(
                                                                    route(
                                                                        "admin.users.destroy",
                                                                        u.id,
                                                                    ),
                                                                );
                                                        }}
                                                    >
                                                        <IconTrash size={18} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Paper>
            </Stack>

            {/* DRAWER DETAIL USER */}
            <Drawer
                opened={opened}
                onClose={close}
                title="Detail Pengguna"
                position="right"
                size="md"
                padding="md"
            >
                {selectedUser && (
                    <Stack gap="lg">
                        {/* 1. Header Profil */}
                        <Box
                            ta="center"
                            bg="gray.0"
                            p="md"
                            style={{ borderRadius: 8 }}
                        >
                            <Avatar
                                src={selectedUser.avatar}
                                size={80}
                                radius={80}
                                mx="auto"
                                mb="sm"
                                color="blue"
                            >
                                {selectedUser.name?.charAt(0)}
                            </Avatar>
                            <Title order={4}>{selectedUser.name}</Title>
                            <Text size="sm" c="dimmed">
                                {selectedUser.email}
                            </Text>
                            <Group justify="center" mt="xs">
                                <Badge
                                    color={
                                        selectedUser.role === "staff_umkm"
                                            ? "blue"
                                            : "orange"
                                    }
                                >
                                    {selectedUser.role.toUpperCase()}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    color={
                                        selectedUser.is_active ? "green" : "red"
                                    }
                                >
                                    {selectedUser.is_active
                                        ? "Status: Aktif"
                                        : "Status: Blokir"}
                                </Badge>
                            </Group>
                            {selectedUser.bio && (
                                <Text size="sm" mt="md" fs="italic">
                                    "{selectedUser.bio}"
                                </Text>
                            )}
                        </Box>

                        <Divider />

                        {/* 2. Informasi Bank (Penting untuk Pencairan) */}
                        <Box>
                            <Group mb="sm">
                                <ThemeIcon color="green" variant="light">
                                    <IconBuildingBank size={18} />
                                </ThemeIcon>
                                <Text fw={600}>Informasi Rekening Bank</Text>
                            </Group>
                            <Paper withBorder p="sm" radius="md" bg="gray.0">
                                <SimpleGrid
                                    cols={2}
                                    spacing="xs"
                                    verticalSpacing="xs"
                                >
                                    <Box>
                                        <Text size="xs" c="dimmed">
                                            Nama Bank
                                        </Text>
                                        <Text size="sm" fw={500}>
                                            {selectedUser.bank_name || "-"}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text size="xs" c="dimmed">
                                            No. Rekening
                                        </Text>
                                        <Text
                                            size="sm"
                                            fw={500}
                                            family="monospace"
                                        >
                                            {selectedUser.bank_account_number ||
                                                "-"}
                                        </Text>
                                    </Box>
                                    <Box style={{ gridColumn: "span 2" }}>
                                        <Text size="xs" c="dimmed">
                                            Atas Nama
                                        </Text>
                                        <Text size="sm" fw={500}>
                                            {selectedUser.bank_account_name ||
                                                "-"}
                                        </Text>
                                    </Box>
                                </SimpleGrid>
                            </Paper>
                        </Box>

                        <Divider />

                        {/* 3. Media Sosial */}
                        <Box>
                            <Group mb="sm">
                                <ThemeIcon color="pink" variant="light">
                                    <IconBrandInstagram size={18} />
                                </ThemeIcon>
                                <Text fw={600}>Media Sosial & Kontak</Text>
                            </Group>

                            <Stack gap="sm">
                                {/* Whatsapp */}
                                <Group
                                    justify="space-between"
                                    p="xs"
                                    style={{
                                        border: "1px solid #eee",
                                        borderRadius: 8,
                                    }}
                                >
                                    <Group gap="xs">
                                        <IconBrandWhatsapp
                                            size={20}
                                            color="green"
                                        />
                                        <Text size="sm">WhatsApp</Text>
                                    </Group>
                                    <Text size="sm" fw={500}>
                                        {selectedUser.whatsapp ||
                                            selectedUser.phone_number ||
                                            "-"}
                                    </Text>
                                </Group>

                                {/* Instagram */}
                                <Group
                                    justify="space-between"
                                    p="xs"
                                    style={{
                                        border: "1px solid #eee",
                                        borderRadius: 8,
                                    }}
                                >
                                    <Group gap="xs">
                                        <IconBrandInstagram
                                            size={20}
                                            color="#E1306C"
                                        />
                                        <Box>
                                            <Text size="sm">Instagram</Text>
                                            {selectedUser.ig_followers && (
                                                <Text size="xs" c="dimmed">
                                                    {selectedUser.ig_followers}{" "}
                                                    Followers
                                                </Text>
                                            )}
                                        </Box>
                                    </Group>
                                    <Text
                                        component="a"
                                        href={
                                            selectedUser.ig_profile_url || "#"
                                        }
                                        target="_blank"
                                        size="sm"
                                        c="blue"
                                        style={{
                                            cursor: selectedUser.ig_profile_url
                                                ? "pointer"
                                                : "default",
                                        }}
                                    >
                                        {selectedUser.instagram_username
                                            ? `@${selectedUser.instagram_username}`
                                            : "-"}
                                    </Text>
                                </Group>

                                {/* TikTok */}
                                <Group
                                    justify="space-between"
                                    p="xs"
                                    style={{
                                        border: "1px solid #eee",
                                        borderRadius: 8,
                                    }}
                                >
                                    <Group gap="xs">
                                        <IconBrandTiktok
                                            size={20}
                                            color="black"
                                        />
                                        <Box>
                                            <Text size="sm">TikTok</Text>
                                            {selectedUser.tiktok_followers && (
                                                <Text size="xs" c="dimmed">
                                                    {
                                                        selectedUser.tiktok_followers
                                                    }{" "}
                                                    Followers
                                                </Text>
                                            )}
                                        </Box>
                                    </Group>
                                    <Text
                                        component="a"
                                        href={
                                            selectedUser.tiktok_profile_url ||
                                            "#"
                                        }
                                        target="_blank"
                                        size="sm"
                                        c="blue"
                                        style={{
                                            cursor: selectedUser.tiktok_profile_url
                                                ? "pointer"
                                                : "default",
                                        }}
                                    >
                                        {selectedUser.tiktok_username
                                            ? `@${selectedUser.tiktok_username}`
                                            : "-"}
                                    </Text>
                                </Group>
                            </Stack>
                        </Box>

                        <Divider />

                        <Group justify="flex-end">
                            <Button variant="default" onClick={close}>
                                Tutup
                            </Button>
                        </Group>
                    </Stack>
                )}
            </Drawer>
        </AuthenticatedLayout>
    );
}
