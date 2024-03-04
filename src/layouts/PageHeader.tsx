import './PageHeader.css'
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    title: string;
    back?: boolean;
    links?: [{
        label: string;
        target: string;
        primary?: boolean
    }];
}

const PageHeader: React.FC<HeaderProps> = (props) => {
    const navigate = useNavigate();
    
    return (
        <div className='page-header'>
            <div className='page-header-heading'>
                <div className='page-header-heading-left'>
                    <div className='page-header-back' style={{display: props.back ? 'block' : 'none' }}>
                        <div className='page-header-back-button'>
                            <Button type="link" icon={<ArrowLeftOutlined />} onClick={()=>navigate(-1)}/>
                        </div>
                    </div>
                    <span className='page-header-heading-title'>{props.title}</span>
                </div>
                <div className='page-header-heading-right' style={{display: props.links ? 'block' : 'none' }}>
                    {props.links?.map((link) =>{
                        return (
                            <Button key={link.target}
                                type={link.primary ? 'primary' : 'default'} 
                                onClick={()=>navigate(link.target!)}
                            >{link.label}</Button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default PageHeader