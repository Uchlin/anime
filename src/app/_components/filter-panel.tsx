export function FilterPanel() {
    return (
      <div className="flex flex-wrap gap-4 items-center border-b pb-4">
        <select className="border rounded-lg p-2">
          <option value="">Все жанры</option>
          <option value="Action">Экшен</option>
          <option value="Drama">Драма</option>
          <option value="Fantasy">Фэнтези</option>
        </select>
        <select className="border rounded-lg p-2">
          <option value="">Все года</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
          <option value="2016">2016</option>
          <option value="2015">2015</option>
          <option value="2014">2014</option>
          <option value="2013">2013</option>
          <option value="2012">2012</option>
          <option value="2011">2011</option>
          <option value="2010">2010</option>
        </select>
        <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg">
          Применить
        </button>
      </div>
    );
  }