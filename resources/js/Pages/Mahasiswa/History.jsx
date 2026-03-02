import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import {
    Stack,
    Group,
    Paper,
    Text,
    Title,
    Table,
    Badge,
    Button,
    Card,
    SimpleGrid,
    Box,
    ScrollArea,
    Modal,
    Image,
    ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DateInput } from "@mantine/dates";
import { IconPhoto } from "@tabler/icons-react";
import { useState } from "react";
import dayjs from "dayjs";

export default function History({ auth, commissions, summary, filters }) {
    const [startDate, setStartDate] = useState(
        filters.start_date ? new Date(filters.start_date) : null,
    );
    const [endDate, setEndDate] = useState(
        filters.end_date ? new Date(filters.end_date) : null,
    );

    // State untuk Modal Bukti Foto
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedProof, setSelectedProof] = useState(null);

    // Fungsi untuk menghitung total pendapatan secara dinamis di frontend
    const calculateFilteredTotal = () => {
        return commissions.reduce((acc, curr) => {
            // Hanya menjumlahkan yang statusnya 'approved'
            if (curr.status === "approved") {
                return acc + parseFloat(curr.amount);
            }
            return acc;
        }, 0);
    };

    const handleFilter = () => {
        router.get(
            route("mahasiswa.claim.history"), // Sesuaikan dengan nama route di web.php Anda
            {
                start_date: startDate
                    ? dayjs(startDate).format("YYYY-MM-DD")
                    : "",
                end_date: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
            },
            { preserveState: true },
        );
    };

    const resetFilter = () => {
        setStartDate(null);
        setEndDate(null);
        router.get(route("mahasiswa.claim.history"));
    };

    // Handler untuk membuka gambar
    const handleViewProof = (imagePath) => {
        setSelectedProof(imagePath);
        open();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Riwayat Klaim" />

            <Stack gap="xl">
                <Box>
                    <Title order={2}>Riwayat Klaim & Pendapatan</Title>
                    <Text c="dimmed">
                        Lihat detail pendapatan komisi yang kamu peroleh.
                    </Text>
                </Box>

                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                    {/* Input Filter Tanggal */}
                    <Paper withBorder p="md" radius="md">
                        <Text size="sm" fw={700} mb="xs">
                            Cari Berdasarkan Tanggal
                        </Text>
                        <Group align="flex-end" gap="xs">
                            <DateInput
                                label="Dari"
                                placeholder="Pilih tanggal"
                                value={startDate}
                                onChange={setStartDate}
                                size="xs"
                                clearable
                            />
                            <DateInput
                                label="Sampai"
                                placeholder="Pilih tanggal"
                                value={endDate}
                                onChange={setEndDate}
                                size="xs"
                                clearable
                            />
                            <Button size="xs" onClick={handleFilter}>
                                Cari
                            </Button>
                            <Button
                                size="xs"
                                variant="subtle"
                                color="gray"
                                onClick={resetFilter}
                            >
                                Reset
                            </Button>
                        </Group>
                    </Paper>

                    {/* Ringkasan Hasil Filter */}
                    <Card withBorder radius="md" bg="teal.0">
                        <Stack gap={0}>
                            <Text size="xs" c="teal.9" fw={700} tt="uppercase">
                                Total Pendapatan Disetujui
                            </Text>
                            <Title order={2} c="teal.9">
                                Rp{" "}
                                {calculateFilteredTotal().toLocaleString(
                                    "id-ID",
                                )}
                            </Title>
                            <Text size="xs" c="teal.7">
                                Dari {commissions.length} aktivitas klaim yang
                                tampil
                            </Text>
                        </Stack>
                    </Card>
                </SimpleGrid>

                {/* Tabel Riwayat dengan ScrollArea untuk Responsivitas HP */}
                <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
                    <ScrollArea>
                        <Table
                            verticalSpacing="sm"
                            highlightOnHover
                            striped
                            miw={700}
                        >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Tanggal</Table.Th>
                                    <Table.Th>Produk</Table.Th>
                                    <Table.Th>ID Pesanan</Table.Th>
                                    <Table.Th>Nominal</Table.Th>
                                    <Table.Th>Bukti</Table.Th>{" "}
                                    {/* Kolom Baru */}
                                    <Table.Th>Status</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {commissions.length > 0 ? (
                                    commissions.map((item) => (
                                        <Table.Tr key={item.id}>
                                            <Table.Td>
                                                {dayjs(item.created_at).format(
                                                    "DD MMM YYYY",
                                                )}
                                            </Table.Td>
                                            <Table.Td fw={500}>
                                                {item.product?.name ||
                                                    "Produk Dihapus"}
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="xs">
                                                    {item.shopee_order_id}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td fw={700}>
                                                Rp{" "}
                                                {parseFloat(
                                                    item.amount,
                                                ).toLocaleString("id-ID")}
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
                                                    color={
                                                        item.status ===
                                                        "approved"
                                                            ? "green"
                                                            : item.status ===
                                                                "pending"
                                                              ? "orange"
                                                              : "red"
                                                    }
                                                    variant="light"
                                                >
                                                    {item.status}
                                                </Badge>
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
                                            Tidak ada data klaim untuk periode
                                            ini.
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
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
