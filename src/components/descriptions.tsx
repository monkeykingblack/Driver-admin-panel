import React, { Key, ReactNode } from 'react';

import { cn } from '~/libs';

export type DescriptionsProps = {
  title: string;
  description?: string;
  className?: string;
  extra?: ReactNode;
  items: Array<{ key: Key } & DescriptionsItemProps>;
  children?: ReactNode;
};

const Descriptions = (props: DescriptionsProps) => {
  const { title, description, extra, className } = props;

  console.log(props.children, !!props.children);

  return (
    <div className={cn('m-auto p-5', className)}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {extra && <div>{extra}</div>}
      </div>
      <div className="mb-4 flex flex-col">
        {!!props.children
          ? props.children
          : props.items.map(({ key, ...item }) => <DescriptionsItem key={key} {...item} />)}
      </div>
    </div>
  );
};

Descriptions.displayName = Descriptions;

export type DescriptionsItemProps = {
  label: string;
  children: React.ReactNode;
};

const DescriptionsItem = (props: DescriptionsItemProps) => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-2 border-t py-5 md:grid-cols-12 md:py-6">
      <div className="col-span-4 text-sm font-semibold text-foreground">{props.label}</div>
      <div className="col-span-8 text-sm text-muted-foreground">{props.children}</div>
    </div>
  );
};

DescriptionsItem.displayName = 'DescriptionsItem';

export { Descriptions, DescriptionsItem };
