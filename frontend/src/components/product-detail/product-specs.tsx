import React from 'react';

interface SpecificationItem {
  label: string;
  value: string;
}

interface ProductSpecsProps {
  specs?: SpecificationItem[] | null;
  description?: string;
}

export function ProductSpecs({ specs, description }: ProductSpecsProps) {
  return (
    <div className="mt-5 flex flex-col gap-5">
      {specs && specs.length > 0 && (
        <section>
          <h2 className="text-[14px] font-bold text-sn-text mb-2.5">ویژگی‌ها</h2>
          <div className="grid grid-cols-3 gap-2">
            {specs.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-[9px] border border-sn-line text-center text-[9px] text-[#708078] bg-white flex flex-col justify-center items-center"
              >
                <b className="block mb-1 text-[10px] text-[#334c3e] font-bold">
                  {item.label}
                </b>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {description && (
        <section>
          <h2 className="text-[14px] font-bold text-sn-text mb-2">درباره محصول</h2>
          <p className="text-[11px] text-sn-muted leading-[2] text-justify">
            {description}
          </p>
        </section>
      )}
    </div>
  );
}
