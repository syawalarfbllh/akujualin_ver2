import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import {
    Table,
    Badge,
    Button,
    Group,
    Text,
    Paper,
    Stack,
    Box,
    Title,
    ThemeIcon,
    ActionIcon,
    Tooltip,
} from "@mantine/core";
import {
    IconCheck,
    IconX,
    IconDownload,
    IconExternalLink,
    IconClipboardList,
    IconMoodEmpty,
} from "@tabler/icons-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function Index({ auth, commissions = [] }) {
    // FUNGSI EXPORT EXCEL
    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Laporan Komisi");

        worksheet.columns = [
            { header: "Tanggal", key: "date", width: 15 },
            { header: "Mahasiswa", key: "student", width: 25 },
            { header: "Produk", key: "product", width: 25 },
            { header: "Order ID Shopee", key: "order_id", width: 20 },
            { header: "Komisi (Rp)", key: "amount", width: 15 },
            { header: "Status", key: "status", width: 15 },
        ];

        commissions.forEach((item) => {
            worksheet.addRow({
                date: new Date(item.created_at).toLocaleDateString("id-ID"),
                student: item.user?.name,
                product: item.product?.name,
                order_id: item.shopee_order_id,
                amount: item.amount,
                status: item.status.toUpperCase(),
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(
            new Blob([buffer]),
            `Laporan_Komisi_UMKM_${new Date().toISOString().slice(0, 10)}.xlsx`,
        );
    };

    // FUNGSI UPDATE STATUS
    const updateStatus = (id, status) => {
        if (confirm(`Yakin ingin mengubah status klaim menjadi ${status}?`)) {
            router.patch(route("staff.commission.update", id), { status });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Validasi Komisi" />

            <Stack gap="xl">
                <Group justify="space-between" align="flex-end">
                    <Box>
                        <Group gap="xs" mb="xs">
                            <ThemeIcon size="lg" color="indigo" variant="light">
                                <IconClipboardList size={20} />
                            </ThemeIcon>
                            <Title order={2}>Validasi Klaim Komisi</Title>
                        </Group>
                        <Text size="sm" c="dimmed">
                            Cek validitas ID Pesanan Shopee sebelum menyetujui
                            klaim mahasiswa.
                        </Text>
                    </Box>
                    <Button
                        leftSection={<IconDownload size={16} />}
                        color="green"
                        variant="light"
                        onClick={exportToExcel}
                        disabled={commissions.length === 0}
                    >
                        Export Laporan Excel
                    </Button>
                </Group>

                <Paper withBorder radius="md" p="md" shadow="xs">
                    <Table.ScrollContainer minWidth={800}>
                        <Table verticalSpacing="md" highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Tanggal & Mahasiswa</Table.Th>
                                    <Table.Th>Info Produk</Table.Th>
                                    <Table.Th>Shopee Order ID</Table.Th>
                                    <Table.Th>Nominal</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Aksi</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {commissions.length > 0 ? (
                                    commissions.map((item) => (
                                        <Table.Tr key={item.id}>
                                            <Table.Td>
                                                <Text size="xs" c="dimmed">
                                                    {new Date(
                                                        item.created_at,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                    )}
                                                </Text>
                                                <Text fw={600} size="sm">
                                                    {item.user?.name}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm">
                                                    {item.product?.name}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Group gap="xs">
                                                    <Text
                                                        fw={700}
                                                        c="blue.8"
                                                        family="monospace"
                                                    >
                                                        {item.shopee_order_id}
                                                    </Text>
                                                    <Tooltip label="Cek Pesanan di Shopee">
                                                        <ActionIcon
                                                            size="sm"
                                                            variant="subtle"
                                                            color="orange"
                                                        >
                                                            <IconExternalLink
                                                                size={14}
                                                            />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </Group>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text fw={700} c="green.8">
                                                    Rp{" "}
                                                    {Number(
                                                        item.amount,
                                                    ).toLocaleString("id-ID")}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge
                                                    variant="filled"
                                                    color={
                                                        item.status ===
                                                        "approved"
                                                            ? "green"
                                                            : item.status ===
                                                                "pending"
                                                              ? "yellow"
                                                              : "red"
                                                    }
                                                >
                                                    {item.status}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                {item.status === "pending" ? (
                                                    <Group gap="xs">
                                                        <Button
                                                            size="compact-xs"
                                                            color="green"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    item.id,
                                                                    "approved",
                                                                )
                                                            }
                                                            leftSection={
                                                                <IconCheck
                                                                    size={12}
                                                                />
                                                            }
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="compact-xs"
                                                            color="red"
                                                            variant="outline"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    item.id,
                                                                    "rejected",
                                                                )
                                                            }
                                                            leftSection={
                                                                <IconX
                                                                    size={12}
                                                                />
                                                            }
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Group>
                                                ) : (
                                                    <Text
                                                        size="xs"
                                                        c="dimmed"
                                                        fs="italic"
                                                    >
                                                        Tervalidasi
                                                    </Text>
                                                )}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))
                                ) : (
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={6}
                                            ta="center"
                                            py="xl"
                                        >
                                            <Stack align="center" gap="xs">
                                                <IconMoodEmpty
                                                    size={40}
                                                    color="gray"
                                                />
                                                <Text c="dimmed">
                                                    Belum ada klaim komisi untuk
                                                    divalidasi.
                                                </Text>
                                            </Stack>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Paper>
            </Stack>
        </AuthenticatedLayout>
    );
}
