import React, { useEffect, useState } from 'react';
import axios from '@/api/axios.ts';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Typography, Modal, message, Form, Input } from 'antd';
import { TNews } from '@/types/news';
import styles from './style.module.scss';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const NewsPage: React.FC = () => {
    const [news, setNews] = useState<TNews[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingNews, setEditingNews] = useState<TNews | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await axios.get<TNews[]>('/api/v1/news/');
            setNews(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке:', error);
            message.error('Не удалось загрузить новости');
        }
    };

    const handleOpenModal = (item?: TNews) => {
        setEditingNews(item || null);
        setIsModalVisible(true);
        if (item) {
            form.setFieldsValue(item);
        } else {
            form.resetFields();
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setEditingNews(null);
        form.resetFields();
    };

    const handleDeleteNews = async (id: number) => {
        try {
            await axios.delete(`/api/v1/news/${id}/`);
            message.success('Новость удалена');
            fetchNews();
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            message.error('Не удалось удалить новость');
        }
    };

    const handleSubmit = async (values: Omit<TNews, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            if (editingNews) {
                await axios.put(`/api/v1/news/${editingNews.id}/`, values);
                message.success('Новость изменена');
            } else {
                await axios.post('/api/v1/news/', values);
                message.success('Новость добавлена');
            }
            handleCloseModal();
            fetchNews();
        } catch (error) {
            console.error('Ошибка при добавлении:', error);
            message.error('Ошибка при добавлении новости');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>Последние новости</div>
            <Button type="primary" className={styles.btn} onClick={() => handleOpenModal()}>
                Добавить новость
            </Button>
            <div className={styles.newsWrapper}>
                {news.map((item) => (
                    <Card
                        key={item.id}
                        title={item.title}
                        extra={<Text type="secondary">{formatDate(item.created_at)}</Text>}
                    >
                        <Paragraph ellipsis={{rows: 3, expandable: true, symbol: 'more'}}>
                            {item.content}
                        </Paragraph>
                        <div className={styles.metadata}>
                            <div>
                                <Text strong>Автор: </Text><Text>{item.author}</Text>
                            </div>
                            <div>
                                <Text strong>Тема: </Text><Text>{item.theme}</Text>
                            </div>
                        </div>
                        <Text type="secondary">
                            Последнее обновление: {formatDate(item.updated_at)}
                        </Text>
                        <div className={styles.cardActions}>
                            <Button onClick={() => handleOpenModal(item)}><EditOutlined /></Button>
                            <Button danger onClick={() => handleDeleteNews(item.id)}><DeleteOutlined /></Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                title={editingNews ? "Изменить новость" : "Создать новость"}
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="title"
                        label="Заголовок"
                        rules={[{ required: true, message: 'Please input the title!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="Контент"
                        rules={[{ required: true, message: 'Please input the content!' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        name="author"
                        label="Автор"
                        rules={[{ required: true, message: 'Please input the author!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="theme"
                        label="Тема"
                        rules={[{ required: true, message: 'Please select the theme!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingNews ? 'Обновить' : 'Создать'}
                        </Button>
                        <Button onClick={handleCloseModal} style={{ marginLeft: 8 }}>
                            Отмена
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default NewsPage;