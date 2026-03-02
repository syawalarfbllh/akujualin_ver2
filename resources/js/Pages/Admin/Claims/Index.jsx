import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";
import {
    Table,
    Badge,
    Title,
    Stack,
    Paper,
    Text,
    Box,
    ScrollArea,
    Group,
    TextInput,
    Select,
    Button,
    ActionIcon,
    Avatar,
    Pagination,
    Grid,
    Tooltip,
    Center,
    Loader,
} from "@mantine/core";
import {
    IconSearch,
    IconFilter,
    IconRefresh,
    IconExternalLink,
    IconBuildingStore,
    IconPackage,
    IconAlertCircle,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useDebouncedValue } from "@mantine/hooks";

export default function AdminClaimIndex({
    auth,
    commissions,
    sellers,
    filters,
}) {
    // 1. Setup State Filter
    const [search, setSearch] = useState(filters.search || "");
    const [productName, setProductName] = useState(filters.product_name || "");
    const [status, setStatus] = useState(filters.status || null);
    const [sellerId, setSellerId] = useState(filters.seller_id || null);

    // Debounce agar tidak request setiap ketikan (tunggu 500ms)
    const [debouncedSearch] = useDebouncedValue(search, 500);
    const [debouncedProduct] = useDebouncedValue(productName, 500);

    // 2. Fungsi Filter Utama
    const applyFilter = (page = 1) => {
        router.get(
            route("admin.claims.index"),
            {
                search: debouncedSearch,
                product_name: debouncedProduct,
                status: status,
                seller_id: sellerId,
                page: page, // Kirim halaman saat ini
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    // 3. Trigger Filter saat nilai berubah (kecuali Page)
    useEffect(() => {
        // Cek apakah nilai berubah dari props awal untuk mencegah loop infinite
        const isChanged =
            debouncedSearch !== (filters.search || "") ||
            debouncedProduct !== (filters.product_name || "") ||
            status !== (filters.status || null) ||
            sellerId !== (filters.seller_id || null);

        if (isChanged) {
            applyFilter(1); // Reset ke halaman 1 jika filter berubah
        }
    }, [debouncedSearch, debouncedProduct, status, sellerId]);

    const resetFilters = () => {
        setSearch("");
        setProductName("");
        setStatus(null);
        setSellerId(null);
        router.get(route("admin.claims.index"));
    };

    // 4. Destructuring Data Pagination (Safe Access)
    // Gunakan optional chaining (?.) untuk mencegah error "undefined"
    const dataList = commissions?.data || [];
    const meta = {
        current_page: commissions?.current_page || 1,
        last_page: commissions?.last_page || 1,
        from: commissions?.from || 0,
        to: commissions?.to || 0,
        total: commissions?.total || 0,
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Monitoring Klaim & Komisi" />

            <Stack gap="lg">
                {/* HEADER */}
                <Group justify="space-between" align="flex-end">
                    <Box>
                        <Title order={2}>Pencairan Komisi</Title>
                        <Text c="dimmed">
                            Validasi dan pantau arus kas komisi affiliator.
                        </Text>
                    </Box>
                    <Button
                        variant="subtle"
                        color="gray"
                        leftSection={<IconRefresh size={16} />}
                        onClick={resetFilters}
                    >
                        Reset Filter
                    </Button>
                </Group>

                {/* FILTER CARD */}
                <Paper p="md" radius="md" withBorder shadow="xs" bg="white">
                    <Grid align="flex-end">
                        <Grid.Col span={{ base: 12, md: 3 }}>
                            <TextInput
                                label="Cari Transaksi"
                                placeholder="Nama / Order ID..."
                                leftSection={<IconSearch size={16} />}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 3 }}>
                            <TextInput
                                label="Filter Produk"
                                placeholder="Nama Produk..."
                                leftSection={<IconPackage size={16} />}
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 3 }}>
                            <Select
                                label="Filter Seller (UMKM)"
                                placeholder="Pilih Seller"
                                leftSection={<IconBuildingStore size={16} />}
                                data={sellers.map((s) => ({
                                    value: String(s.id),
                                    label: s.name,
                                }))}
                                value={sellerId}
                                onChange={setSellerId}
                                clearable
                                searchable
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 3 }}>
                            <Select
                                label="Status Komisi"
                                placeholder="Semua Status"
                                leftSection={<IconFilter size={16} />}
                                data={[
                                    { value: "pending", label: "⏳ Pending" },
                                    { value: "approved", label: "✅ Approved" },
                                    { value: "rejected", label: "❌ Rejected" },
                                ]}
                                value={status}
                                onChange={setStatus}
                                clearable
                            />
                        </Grid.Col>
                    </Grid>
                </Paper>

                {/* TABLE CARD */}
                <Paper
                    withBorder
                    radius="md"
                    shadow="sm"
                    p={0}
                    style={{ overflow: "hidden" }}
                >
                    <ScrollArea>
                        <Table verticalSpacing="md" highlightOnHover miw={1000}>
                            <Table.Thead bg="gray.0">
                                <Table.Tr>
                                    <Table.Th>Mahasiswa</Table.Th>
                                    <Table.Th>Produk & Seller</Table.Th>
                                    <Table.Th>Detail Order</Table.Th>
                                    <Table.Th>Komisi</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th style={{ textAlign: "center" }}>
                                        Aksi
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {dataList.length > 0 ? (
                                    dataList.map((item) => (
                                        <RowItem key={item.id} item={item} />
                                    ))
                                ) : (
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={6}
                                            align="center"
                                            py={40}
                                        >
                                            <Stack align="center" gap="xs">
                                                <IconAlertCircle
                                                    size={40}
                                                    color="gray"
                                                    style={{ opacity: 0.3 }}
                                                />
                                                <Text c="dimmed">
                                                    Tidak ada data klaim
                                                    ditemukan.
                                                </Text>
                                            </Stack>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>

                    {/* PAGINATION SECTION */}
                    {meta.last_page > 1 && (
                        <Group
                            justify="space-between"
                            p="md"
                            bg="gray.0"
                            style={{ borderTop: "1px solid #eee" }}
                        >
                            <Text size="sm" c="dimmed">
                                Menampilkan {meta.from} - {meta.to} dari{" "}
                                {meta.total} data
                            </Text>
                            <Pagination
                                total={meta.last_page}
                                value={meta.current_page}
                                onChange={(page) => applyFilter(page)} // Panggil fungsi filter dengan page baru
                                color="blue"
                                size="sm"
                                siblings={1}
                            />
                        </Group>
                    )}
                </Paper>
            </Stack>
        </AuthenticatedLayout>
    );
}

// Sub-komponen Baris
function RowItem({ item }) {
    const isPending = item.status === "pending";
    const isApproved = item.status === "approved";

    return (
        <Table.Tr>
            <Table.Td>
                <Group gap="sm" wrap="nowrap">
                    <Avatar
                        src={item.user?.avatar}
                        name={item.user?.name}
                        color="blue"
                        variant="light"
                        size="md"
                    >
                        {item.user?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                        <Text
                            size="sm"
                            fw={600}
                            style={{ whiteSpace: "nowrap" }}
                        >
                            {item.user?.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {item.user?.email}
                        </Text>
                    </Box>
                </Group>
            </Table.Td>

            <Table.Td>
                <Stack gap={2}>
                    <Text
                        size="sm"
                        fw={500}
                        lineClamp={1}
                        title={item.product?.name}
                    >
                        {item.product?.name || "Produk Dihapus"}
                    </Text>
                    <Group gap={4}>
                        <IconBuildingStore size={12} color="gray" />
                        <Text size="xs" c="dimmed">
                            {item.product?.seller?.name || "Seller Dihapus"}
                        </Text>
                    </Group>
                </Stack>
            </Table.Td>

            <Table.Td>
                <Box>
                    <Text family="monospace" fw={700} size="sm">
                        {item.shopee_order_id}
                    </Text>
                    <Text size="xs" c="dimmed">
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </Text>
                </Box>
            </Table.Td>

            <Table.Td>
                <Text fw={700} c={isApproved ? "teal" : "dark"} size="sm">
                    Rp {Number(item.amount).toLocaleString("id-ID")}
                </Text>
            </Table.Td>

            <Table.Td>
                <Badge
                    variant={isPending ? "dot" : "light"}
                    color={isApproved ? "teal" : isPending ? "orange" : "red"}
                >
                    {item.status.toUpperCase()}
                </Badge>
            </Table.Td>

            <Table.Td style={{ textAlign: "center" }}>
                <Tooltip label="Lihat Detail">
                    <ActionIcon variant="subtle" color="blue">
                        <IconExternalLink size={18} />
                    </ActionIcon>
                </Tooltip>
            </Table.Td>
        </Table.Tr>
    );
}
