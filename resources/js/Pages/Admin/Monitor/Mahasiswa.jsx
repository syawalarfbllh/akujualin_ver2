import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Table,
    Avatar,
    Text,
    Group,
    Badge,
    Paper,
    Title,
    Progress,
    Stack,
    ScrollArea,
} from "@mantine/core";
import { IconSchool, IconTrophy } from "@tabler/icons-react";

export default function MonitorMahasiswa({ auth, students }) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number || 0);
    };

    const rows = students.data.map((item, index) => {
        // Logika Rank Sederhana
        let rankColor = "gray";
        if (index === 0) rankColor = "yellow"; // Emas
        if (index === 1) rankColor = "gray.5"; // Perak
        if (index === 2) rankColor = "orange"; // Perunggu

        return (
            <Table.Tr key={item.id}>
                <Table.Td width={50} align="center">
                    {index < 3 ? (
                        <IconTrophy
                            size={20}
                            color={`var(--mantine-color-${rankColor}-6)`}
                        />
                    ) : (
                        index + 1
                    )}
                </Table.Td>
                <Table.Td>
                    <Group gap="sm">
                        <Avatar src={item.avatar} radius="xl" color="teal">
                            {item.name.charAt(0)}
                        </Avatar>
                        <div>
                            <Text fz="sm" fw={500}>
                                {item.name}
                            </Text>
                            <Text fz="xs" c="dimmed">
                                {item.email}
                            </Text>
                        </div>
                    </Group>
                </Table.Td>
                <Table.Td>
                    <Badge
                        variant="dot"
                        color={item.total_sales > 0 ? "green" : "gray"}
                    >
                        {item.total_sales} Penjualan
                    </Badge>
                </Table.Td>
                <Table.Td align="right">
                    <Text fw={700} c="teal">
                        {formatRupiah(item.total_earned)}
                    </Text>
                    <Text fz="xs" c="dimmed">
                        Total Komisi Cair
                    </Text>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Monitoring Mahasiswa" />
            <Stack>
                <Group justify="space-between">
                    <Title order={3}>Monitoring Kinerja Mahasiswa</Title>
                    <Link href={route("dashboard")}>
                        <Badge color="gray">Kembali ke Dashboard</Badge>
                    </Link>
                </Group>

                <Paper withBorder p="md" radius="md">
                    <ScrollArea>
                        <Table highlightOnHover verticalSpacing="sm" miw={900}>
                            <Table.Thead bg="gray.0">
                                <Table.Tr>
                                    <Table.Th style={{ textAlign: "center" }}>
                                        Rank
                                    </Table.Th>
                                    <Table.Th>Nama Mahasiswa</Table.Th>
                                    <Table.Th>Performa Penjualan</Table.Th>
                                    <Table.Th style={{ textAlign: "right" }}>
                                        Total Pendapatan
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {rows.length > 0 ? (
                                    rows
                                ) : (
                                    <Table.Tr>
                                        <Table.Td colSpan={4} align="center">
                                            Belum ada data Mahasiswa
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Paper>
            </Stack>
        </AuthenticatedLayout>
    );
}
