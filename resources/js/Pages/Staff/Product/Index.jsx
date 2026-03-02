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
} from "@mantine/core";
import {
    IconPencil,
    IconTrash,
    IconPlus,
    IconExternalLink,
} from "@tabler/icons-react"; // <-- PASTIKAN IMPORT DI SINI

export default function Index({ auth, products }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            destroy(route("staff.product.destroy", id));
        }
    };

    const rows = products.map((product) => (
        <Table.Tr key={product.id}>
            <Table.Td>
                <Image
                    radius="md"
                    src={`/storage/${product.image}`}
                    h={50}
                    w={50}
                    fallbackSrc="https://placehold.co/100x100?text=No+Image"
                />
            </Table.Td>
            <Table.Td>
                <Text fw={500}>{product.name}</Text>
                <Text size="xs" c="dimmed">
                    {product.slug}
                </Text>
            </Table.Td>
            <Table.Td>
                Rp {Number(product.price).toLocaleString("id-ID")}
            </Table.Td>
            <Table.Td>
                <Badge
                    color={product.stock > 10 ? "green" : "red"}
                    variant="light"
                >
                    {product.stock} pcs
                </Badge>
            </Table.Td>
            <Table.Td>
                <Group gap="xs">
                    {/* Tombol Edit */}
                    <ActionIcon
                        variant="light"
                        color="blue"
                        component={Link}
                        href={route("staff.product.edit", product.id)}
                    >
                        <IconPencil size={18} />
                    </ActionIcon>

                    {/* Tombol Hapus */}
                    <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleDelete(product.id)}
                    >
                        <IconTrash size={18} />
                    </ActionIcon>

                    {/* Link Shopee/External */}
                    {product.product_link && (
                        <ActionIcon
                            variant="light"
                            color="gray"
                            component="a"
                            href={product.product_link}
                            target="_blank"
                        >
                            <IconExternalLink size={18} />
                        </ActionIcon>
                    )}
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Group justify="space-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Manajemen Produk
                    </h2>
                    <Button
                        leftSection={<IconPlus size={16} />}
                        component={Link}
                        href={route("staff.product.create")}
                        color="indigo"
                    >
                        Tambah Produk
                    </Button>
                </Group>
            }
        >
            <Head title="Produk Saya" />

            <Paper withBorder radius="md" p="md">
                <Table verticalSpacing="sm" highlightOnHover>
                    <Table.Thead bg="gray.0">
                        <Table.Tr>
                            <Table.Th>Foto</Table.Th>
                            <Table.Th>Nama Produk</Table.Th>
                            <Table.Th>Harga</Table.Th>
                            <Table.Th>Stok</Table.Th>
                            <Table.Th>Aksi</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {products.length > 0 ? (
                            rows
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={5} align="center">
                                    <Text c="dimmed" py="xl">
                                        Belum ada produk. Silakan tambah produk
                                        baru.
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Paper>
        </AuthenticatedLayout>
    );
}
