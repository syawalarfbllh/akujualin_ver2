import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    TextInput,
    NumberInput,
    Button,
    Paper,
    Stack,
    Group,
    Text,
    FileInput,
    SimpleGrid,
    Image,
    Box,
} from "@mantine/core";
import {
    IconUpload,
    IconArrowLeft,
    IconDeviceFloppy,
} from "@tabler/icons-react";

export default function Edit({ auth, product }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT", // Penting untuk update dengan file upload
        name: product.name,
        price: product.price,
        commission_amount: product.commission_amount,
        stock: product.stock,
        product_link: product.product_link,
        image: null, // Kosongkan kecuali user ingin ganti gambar
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Menggunakan post dengan _method: PUT karena Laravel/Inertia
        // punya kendala upload file via PUT murni
        post(route("staff.product.update", product.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Produk" />

            <Group justify="space-between" mb="lg">
                <Button
                    variant="subtle"
                    leftSection={<IconArrowLeft size={16} />}
                    component={Link}
                    href={route("staff.product.index")}
                >
                    Kembali
                </Button>
                <Text size="xl" fw={700}>
                    Edit Produk: {product.name}
                </Text>
            </Group>

            <Paper withBorder p="xl" radius="md" shadow="sm">
                <form onSubmit={handleSubmit}>
                    <Stack gap="md">
                        <TextInput
                            label="Nama Produk"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            error={errors.name}
                        />

                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                            <NumberInput
                                label="Harga Jual (Rp)"
                                thousandSeparator="."
                                decimalSeparator=","
                                value={data.price}
                                onChange={(val) => setData("price", val)}
                                error={errors.price}
                                prefix="Rp "
                            />

                            <NumberInput
                                label="Komisi Affiliate (Rp)"
                                description="Nominal yang didapat mahasiswa"
                                thousandSeparator="."
                                decimalSeparator=","
                                value={data.commission_amount}
                                onChange={(val) =>
                                    setData("commission_amount", val)
                                }
                                error={errors.commission_amount}
                                prefix="Rp "
                                c="indigo"
                            />
                        </SimpleGrid>

                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                            <NumberInput
                                label="Stok Barang"
                                value={data.stock}
                                onChange={(val) => setData("stock", val)}
                                error={errors.stock}
                            />

                            <TextInput
                                label="Link Produk Shopee"
                                value={data.product_link}
                                onChange={(e) =>
                                    setData("product_link", e.target.value)
                                }
                                error={errors.product_link}
                            />
                        </SimpleGrid>

                        <Box>
                            <Text size="sm" fw={500} mb={5}>
                                Foto Produk Saat Ini
                            </Text>
                            <Image
                                src={`/storage/${product.image}`}
                                h={100}
                                w={100}
                                radius="md"
                                mb="xs"
                                fallbackSrc="https://placehold.co/100"
                            />
                            <FileInput
                                label="Ganti Foto (Kosongkan jika tidak ingin ganti)"
                                placeholder="Klik untuk upload gambar baru"
                                leftSection={<IconUpload size={16} />}
                                accept="image/*"
                                onChange={(file) => setData("image", file)}
                                error={errors.image}
                            />
                        </Box>

                        <Button
                            type="submit"
                            size="lg"
                            mt="xl"
                            loading={processing}
                            leftSection={<IconDeviceFloppy size={20} />}
                            color="orange"
                        >
                            Update Produk
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
