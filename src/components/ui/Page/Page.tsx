import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

interface IProps {
  containerClassName?: string;
  pageClassName?: string;
}

const Page: React.FC<React.PropsWithChildren<IProps>> = ({
  containerClassName,
  children,
  pageClassName,
}) => {
  return (
    <div
      className={cn(
        'flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300',
        pageClassName
      )}
    >
      <Header />
      <main className={cn('flex flex-1 flex-col items-center px-1 md:px-3', containerClassName)}>
        <div className="lg:max-w-7xl w-full">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
