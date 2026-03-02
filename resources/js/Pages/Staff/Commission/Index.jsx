import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useDisclosure } from "@mantine/hooks";
import { DateInput } from "@mantine/dates";
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
    Modal,
    Grid,
    Image,
} from "@mantine/core";
import {
    IconCheck,
    IconX,
    IconDownload,
    IconExternalLink,
    IconClipboardList,
    IconMoodEmpty,
    IconFilter,
    IconPhoto,
} from "@tabler/icons-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function Index({ auth, commissions = [], filters = {} }) {
    // State untuk filter tanggal
    const [startDate, setStartDate] = useState(
        filters.date_start ? new Date(filters.date_start) : null,
    );
    const [endDate, setEndDate] = useState(
        filters.date_end ? new Date(filters.date_end) : null,
    );

    // State untuk Modal Bukti Foto
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedProof, setSelectedProof] = useState(null);

    // FUNGSI LIHAT BUKTI FOTO (Tambahan yang kurang)
    const handleViewProof = (imagePath) => {
        setSelectedProof(imagePath);
        open();
    };

    // FUNGSI FILTER
    const handleFilter = () => {
        const formatDate = (date) => {
            if (!date) return null;

            const dateObj = date instanceof Date ? date : new Date(date);

            // Jika konversi gagal (Invalid Date), return null
            if (isNaN(dateObj.getTime())) return null;

            const offset = dateObj.getTimezoneOffset();
            const adjustedDate = new Date(
                dateObj.getTime() - offset * 60 * 1000,
            );
            return adjustedDate.toISOString().split("T")[0];
        };

        router.get(
            route("staff.commission.index"),
            {
                date_start: formatDate(startDate),
                date_end: formatDate(endDate),
            },
            { preserveState: true },
        );
    };

    // FUNGSI RESET FILTER
    const handleReset = () => {
        setStartDate(null);
        setEndDate(null);
        router.get(route("staff.commission.index"), {}, { replace: true });
    };

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

        worksheet.getRow(1).font = { bold: true };

        commissions.forEach((item) => {
            worksheet.addRow({
                date: new Date(item.created_at).toLocaleDateString("id-ID"),
                student: item.user?.name || "-",
                product: item.product?.name || "-",
                order_id: item.shopee_order_id,
                amount: Number(item.amount),
                status: (item.status || "").toUpperCase(),
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const dateStr = new Date().toISOString().slice(0, 10);
        saveAs(new Blob([buffer]), `Laporan_Komisi_Filtered_${dateStr}.xlsx`);
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
                {/* Header Section */}
                <Group justify="space-between" align="flex-end">
                    <Box>
                        <Group gap="xs" mb="xs">
                            <ThemeIcon size="lg" color="indigo" variant="light">
                                <IconClipboardList size={20} />
                            </ThemeIcon>
                            <Title order={2}>Validasi Klaim Komisi</Title>
                        </Group>
                        <Text size="sm" c="dimmed">
                            Kelola dan validasi klaim komisi mahasiswa
                            berdasarkan periode tertentu.
                        </Text>
                    </Box>

                    <Button
                        leftSection={<IconDownload size={16} />}
                        color="green"
                        variant="filled"
                        onClick={exportToExcel}
                        disabled={commissions.length === 0}
                    >
                        Export Excel (.xlsx)
                    </Button>
                </Group>

                {/* Filter Section */}
                <Paper withBorder radius="md" p="md" bg="gray.0">
                    <Grid align="flex-end">
                        <Grid.Col span={{ base: 12, sm: 4 }}>
                            <DateInput
                                value={startDate}
                                onChange={setStartDate}
                                label="Dari Tanggal"
                                placeholder="Pilih tanggal mulai"
                                clearable
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 4 }}>
                            <DateInput
                                value={endDate}
                                onChange={setEndDate}
                                label="Sampai Tanggal"
                                placeholder="Pilih tanggal akhir"
                                clearable
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 4 }}>
                            <Group grow>
                                <Button
                                    leftSection={<IconFilter size={16} />}
                                    onClick={handleFilter}
                                    color="indigo"
                                >
                                    Filter
                                </Button>
                                <Button
                                    variant="outline"
                                    color="gray"
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Paper>

                {/* Table Section */}
                <Paper withBorder radius="md" p="md" shadow="xs">
                    <Table.ScrollContainer minWidth={800}>
                        <Table verticalSpacing="md" highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Tanggal & Mahasiswa</Table.Th>
                                    <Table.Th>Info Produk</Table.Th>
                                    <Table.Th>Shopee Order ID</Table.Th>
                                    <Table.Th>Nominal</Table.Th>
                                    <Table.Th>Bukti</Table.Th>
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
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        },
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
                                                            component="a"
                                                            href={`https://shopee.co.id/search?keyword=${item.shopee_order_id}`}
                                                            target="_blank"
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
                                                {/* Tombol Lihat Bukti */}
                                                {item.proof_image ? (
                                                    <Badge
                                                        variant="light"
                                                        color="blue"
                                                        leftSection={
                                                            <IconPhoto
                                                                size={12}
                                                            />
                                                        }
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() =>
                                                            handleViewProof(
                                                                item.proof_image,
                                                            )
                                                        }
                                                    >
                                                        Lihat
                                                    </Badge>
                                                ) : (
                                                    <Text size="xs" c="dimmed">
                                                        -
                                                    </Text>
                                                )}
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
                                            colSpan={7} // Diubah jadi 7 karena ada tambahan kolom Bukti
                                            ta="center"
                                            py="xl"
                                        >
                                            <Stack align="center" gap="xs">
                                                <IconMoodEmpty
                                                    size={40}
                                                    color="gray"
                                                />
                                                <Text c="dimmed">
                                                    Tidak ada data klaim untuk
                                                    periode ini.
                                                </Text>
                                            </Stack>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Paper>

                {/* Modal untuk Menampilkan Bukti Foto */}
                <Modal
                    opened={opened}
                    onClose={close}
                    title={<Text fw={700}>Bukti Transaksi</Text>}
                    centered
                >
                    {selectedProof ? (
                        <Image
                            radius="md"
                            src={`/storage/${selectedProof}`}
                            alt="Bukti Klaim"
                            fallbackSrc="https://placehold.co/600x400?text=Gambar+Tidak+Ditemukan"
                        />
                    ) : (
                        <Text c="dimmed" ta="center">
                            Tidak ada gambar yang dipilih.
                        </Text>
                    )}
                </Modal>
            </Stack>
        </AuthenticatedLayout>
    );
}
