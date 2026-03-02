import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Table,
    Button,
    Group,
    Text,
    ActionIcon,
    Badge,
    Image,
    Paper,
    Stack,
    Box,
    Title,
    Tooltip,
    Modal,
    AspectRatio,
    Divider,
    ScrollArea,
    TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconPencil,
    IconTrash,
    IconPlus,
    IconExternalLink,
    IconVideo,
    IconEye,
    IconPackage,
    IconSearch,
} from "@tabler/icons-react";
import { useState } from "react";

export default function Index({ auth, products }) {
    const { delete: destroy } = useForm();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [search, setSearch] = useState("");

    // Filter produk berdasarkan pencarian
    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.slug.toLowerCase().includes(search.toLowerCase()),
    );

    const handleDelete = (id) => {
        if (
            confirm(
                "Apakah Anda yakin ingin menghapus produk ini? Semua data video terkait akan dihapus permanen.",
            )
        ) {
            destroy(route("staff.product.destroy", id));
        }
    };

    const handleOpenDetail = (product) => {
        setSelectedProduct(product);
        open();
    };

    const rows = filteredProducts.map((product) => (
        <Table.Tr key={product.id}>
            <Table.Td>
                <Box pos="relative" w={60}>
                    <Image
                        radius="md"
                        src={`/storage/${product.image}`}
                        h={60}
                        w={60}
                        fallbackSrc="https://placehold.co/100x100?text=No+Image"
                        style={{ border: "1px solid #eee" }}
                    />
                    {product.video_url && (
                        <Tooltip label="Memiliki Video Konten">
                            <ActionIcon
                                size="xs"
                                color="grape"
                                variant="filled"
                                pos="absolute"
                                bottom={-5}
                                right={-5}
                                radius="xl"
                            >
                                <IconVideo size={10} />
                            </ActionIcon>
                        </Tooltip>
                    )}
                </Box>
            </Table.Td>
            <Table.Td>
                <Text fw={600} size="sm" lineClamp={1}>
                    {product.name}
                </Text>
                <Text size="xs" c="dimmed">
                    {product.slug}
                </Text>
            </Table.Td>
            <Table.Td>
                <Stack gap={0}>
                    <Text size="sm" fw={700}>
                        Rp {Number(product.price).toLocaleString("id-ID")}
                    </Text>
                    <Text size="xs" c="green" fw={600}>
                        Komisi: Rp{" "}
                        {Number(product.commission_amount).toLocaleString(
                            "id-ID",
                        )}
                    </Text>
                </Stack>
            </Table.Td>
            <Table.Td>
                <Badge
                    color={product.stock > 10 ? "blue" : "red"}
                    variant="light"
                    leftSection={<IconPackage size={12} />}
                >
                    {product.stock} pcs
                </Badge>
            </Table.Td>
            <Table.Td>
                <Group gap="xs">
                    {/* Tombol Detail */}
                    <Tooltip label="Lihat Detail & Konten">
                        <ActionIcon
                            variant="light"
                            color="cyan"
                            onClick={() => handleOpenDetail(product)}
                        >
                            <IconEye size={18} />
                        </ActionIcon>
                    </Tooltip>

                    {/* Tombol Edit */}
                    <Tooltip label="Edit Produk">
                        <ActionIcon
                            variant="light"
                            color="blue"
                            component={Link}
                            href={route("staff.product.edit", product.id)}
                        >
                            <IconPencil size={18} />
                        </ActionIcon>
                    </Tooltip>

                    {/* Tombol Hapus */}
                    <Tooltip label="Hapus Produk">
                        <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => handleDelete(product.id)}
                        >
                            <IconTrash size={18} />
                        </ActionIcon>
                    </Tooltip>

                    {/* Link External */}
                    {product.product_link && (
                        <Tooltip label="Buka Link Toko">
                            <ActionIcon
                                variant="light"
                                color="gray"
                                component="a"
                                href={product.product_link}
                                target="_blank"
                            >
                                <IconExternalLink size={18} />
                            </ActionIcon>
                        </Tooltip>
                    )}
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Produk" />

            <Stack gap="xl">
                {/* Header Section */}
                <Paper p="md" radius="md" withBorder bg="gray.0" mb="md">
                    <Stack gap="md">
                        <Group justify="space-between" align="center">
                            <Box>
                                <Title order={3} fw={800} ls={-0.5}>
                                    Manajemen Produk
                                </Title>
                                <Text size="xs" c="dimmed">
                                    Total: {filteredProducts.length} Produk
                                    ditemukan
                                </Text>
                            </Box>
                            <TextInput
                                placeholder="Cari nama produk atau slug..."
                                leftSection={
                                    <IconSearch size={14} stroke={1.5} />
                                }
                                style={{ width: 280, maxWidth: "100%" }}
                                value={search}
                                onChange={(e) => setSearch(e.currentTarget.value)}
                                radius="md"
                                size="xs"
                            />
                        </Group>
                    </Stack>
                </Paper>

                {/* Table Section */}
                <Paper
                    withBorder
                    radius="md"
                    p="md"
                    shadow="xs"
                    style={{ backgroundColor: "white" }}
                >
                    <ScrollArea>
                        <Table miw={800} verticalSpacing="md" highlightOnHover>
                            <Table.Thead bg="gray.0">
                                <Table.Tr>
                                    <Table.Th>Foto</Table.Th>
                                    <Table.Th>Informasi Produk</Table.Th>
                                    <Table.Th>Harga & Komisi</Table.Th>
                                    <Table.Th>Stok</Table.Th>
                                    <Table.Th>Aksi</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {products.length > 0 ? (
                                    rows
                                ) : (
                                    <Table.Tr>
                                        <Table.Td
                                            colSpan={5}
                                            align="center"
                                            py={50}
                                        >
                                            <Stack align="center" gap="xs">
                                                <IconPackage
                                                    size={48}
                                                    color="#dee2e6"
                                                />
                                                <Text c="dimmed">
                                                    Belum ada produk yang
                                                    diunggah.
                                                </Text>
                                                <Button
                                                    variant="subtle"
                                                    component={Link}
                                                    href={route(
                                                        "staff.product.create",
                                                    )}
                                                >
                                                    Mulai tambah produk sekarang
                                                </Button>
                                            </Stack>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Paper>
            </Stack>

            {/* MODAL DETAIL PRODUK */}
            <Modal
                opened={opened}
                onClose={close}
                title={<Text fw={700}>Detail Produk & Konten Video</Text>}
                size={{ base: "95%", sm: "lg" }}
                centered
                radius="md"
            >
                {selectedProduct && (
                    <Stack>
                        <Group
                            align="flex-start"
                            grow
                            direction={{ base: "column", sm: "row" }}
                        >
                            <Box>
                                <Text
                                    fw={600}
                                    size="xs"
                                    mb={5}
                                    c="dimmed"
                                    tt="uppercase"
                                >
                                    Preview Video Konten:
                                </Text>
                                {selectedProduct.video_url ? (
                                    <AspectRatio ratio={9 / 16}>
                                        <video
                                            src={`/storage/${selectedProduct.video_url}`}
                                            controls
                                            style={{
                                                borderRadius: "8px",
                                                backgroundColor: "#000",
                                            }}
                                        />
                                    </AspectRatio>
                                ) : (
                                    <Paper
                                        withBorder
                                        h={200}
                                        bg="gray.0"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text size="xs" c="dimmed">
                                            Tidak ada video
                                        </Text>
                                    </Paper>
                                )}
                            </Box>

                            <Stack>
                                <Box>
                                    <Text size="xs" c="dimmed" tt="uppercase">
                                        Deskripsi Produk:
                                    </Text>
                                    <Text size="sm">
                                        {selectedProduct.description ||
                                            "Tidak ada deskripsi."}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        tt="uppercase"
                                        mt="md"
                                    >
                                        Instruksi Brief (Untuk Mahasiswa):
                                    </Text>
                                    <Paper
                                        p="xs"
                                        withBorder
                                        bg="blue.0"
                                        style={{ borderStyle: "dashed" }}
                                    >
                                        <Text size="sm" italic>
                                            "
                                            {selectedProduct.video_brief ||
                                                "Gunakan video ini untuk promosi media sosial."}
                                            "
                                        </Text>
                                    </Paper>
                                </Box>
                                <Divider my="sm" />
                                <Group grow>
                                    <Button
                                        variant="light"
                                        component={Link}
                                        href={route(
                                            "staff.product.edit",
                                            selectedProduct.id,
                                        )}
                                        leftSection={<IconPencil size={16} />}
                                    >
                                        Edit Produk
                                    </Button>
                                </Group>
                            </Stack>
                        </Group>
                    </Stack>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
