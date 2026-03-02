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
} from "@mantine/core";
import {
    IconUpload,
    IconArrowLeft,
    IconDeviceFloppy,
} from "@tabler/icons-react";

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        price: "",
        commission_amount: "", // Field Komisi
        stock: "",
        product_link: "",
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("staff.product.store"));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Tambah Produk Baru" />

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
                    Tambah Produk Baru
                </Text>
            </Group>

            <Paper withBorder p="xl" radius="md" shadow="sm">
                <form onSubmit={handleSubmit}>
                    <Stack gap="md">
                        <TextInput
                            label="Nama Produk"
                            placeholder="Contoh: Keripik Tempe Pedas"
                            required
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            error={errors.name}
                        />

                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                            <NumberInput
                                label="Harga Jual (Rp)"
                                placeholder="10.000"
                                required
                                thousandSeparator="."
                                decimalSeparator=","
                                value={data.price}
                                onChange={(val) => setData("price", val)}
                                error={errors.price}
                                prefix="Rp "
                            />

                            <NumberInput
                                label="Komisi Affiliate (Rp)"
                                placeholder="1.000"
                                required
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
                                placeholder="99"
                                required
                                value={data.stock}
                                onChange={(val) => setData("stock", val)}
                                error={errors.stock}
                            />

                            <TextInput
                                label="Link Produk Shopee"
                                placeholder="https://shopee.co.id/..."
                                required
                                value={data.product_link}
                                onChange={(e) =>
                                    setData("product_link", e.target.value)
                                }
                                error={errors.product_link}
                            />
                        </SimpleGrid>

                        <FileInput
                            label="Foto Produk"
                            placeholder="Klik untuk upload gambar"
                            leftSection={<IconUpload size={16} />}
                            required
                            accept="image/*"
                            onChange={(file) => setData("image", file)}
                            error={errors.image}
                        />

                        <Button
                            type="submit"
                            size="lg"
                            mt="xl"
                            loading={processing}
                            leftSection={<IconDeviceFloppy size={20} />}
                        >
                            Simpan Produk
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </AuthenticatedLayout>
    );
}
