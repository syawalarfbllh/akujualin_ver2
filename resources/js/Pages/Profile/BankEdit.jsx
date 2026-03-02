import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    Container,
    Stack,
    Title,
    Text,
    Paper,
    Box,
    Breadcrumbs,
    Anchor,
} from "@mantine/core";
import UpdatePaymentInformationForm from "./Partials/UpdatePaymentInformationForm";
import { Link } from "@inertiajs/react";

export default function BankEdit({ auth, status }) {
    const items = [
        { title: "Dashboard", href: route("mahasiswa.dashboard") }, // Sesuaikan role
        { title: "Akun", href: "#" },
        { title: "Informasi Rekening", href: null },
    ].map((item, index) =>
        item.href ? (
            <Anchor
                component={Link}
                href={item.href}
                key={index}
                size="xs"
                c="dimmed"
            >
                {item.title}
            </Anchor>
        ) : (
            <Text key={index} size="xs" c="dimmed">
                {item.title}
            </Text>
        ),
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Informasi Rekening" />

            <Container size="sm" py="xl">
                <Stack gap="lg">
                    <Box>
                        <Breadcrumbs mb="xs">{items}</Breadcrumbs>
                        <Title order={2} fw={800} lts="-0.5px">
                            Pengaturan Rekening
                        </Title>
                        <Text c="dimmed" size="sm">
                            Kelola tujuan pengiriman komisi hasil penjualan
                            Anda.
                        </Text>
                    </Box>

                    <Paper
                        withBorder
                        p={{ base: "md", sm: "xl" }}
                        radius="md"
                        shadow="xs"
                    >
                        <UpdatePaymentInformationForm status={status} />
                    </Paper>
                </Stack>
            </Container>
        </AuthenticatedLayout>
    );
}
